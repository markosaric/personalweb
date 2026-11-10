---
title: "How architecture decisions shape your Cosmos DB bill"
summary: "Notes from my NetWork 14 talk: what really drives Cosmos DB cost, why you can get 429s on a quiet database, and when Cosmos DB is the right choice at all."
tag: Azure
date: 2026-11-10
---

In October, at the NetWork conference, I talked about how business and architecture decisions can shape the financial picture of a Cosmos DB bill. This article is a short version of that talk. It focuses on two areas that, in practice, generate most of the cost. After that, I look at how to keep cost under control in production and when Cosmos DB is the right choice at all.

## 1. Documents and indexes have a price

Storage in Cosmos DB is billed as the space your **data plus its indexes** take up, averaged over the hours of the month, in every region the account uses. A bigger document also means more work on every read and write. ([Understand your bill](https://learn.microsoft.com/azure/cosmos-db/understand-your-bill))

So the cheapest large payload is often the one you never store in Cosmos DB at all. A common pattern:

| Before | After |
| --- | --- |
| Order + full history + original payload in one document | Small operational document in Cosmos DB |
| Big document, more work per operation | Original payload in Blob Storage, linked by reference |

Keep in Cosmos DB what you need to query quickly. Put rarely read content in [Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction).

Index the fields your queries actually use. By default every property is indexed, so every write pays for indexes you may never use. Be careful the other way too: excluding a path without checking your queries can break them. ([Indexing policies](https://learn.microsoft.com/azure/cosmos-db/index-policy))

### TTL is not archiving

Time to live (TTL) deletes operational data automatically after a set time. That is useful, but it is a retention tool, not an archive:

- Expired items are removed by a background task. In provisioned throughput the deletes use leftover RU/s; in serverless they are charged like normal delete operations. ([Time to live](https://learn.microsoft.com/azure/cosmos-db/time-to-live))
- Once an item expires, it is gone. If you need it later for audit or analytics, copy it to an archive (for example, Blob Storage with a [cool or archive tier](https://learn.microsoft.com/azure/storage/blobs/access-tiers-overview)) **before** it expires.

Retention, operational data and archive are three different decisions. Plan each one on its own.

## 2. Why do I get 429s if my average usage is low?

A 429 (Request rate too large) means that, at that moment, requests asked for more RU/s than the resource could give. The key word is *resource*: throughput is split evenly across **physical partitions**, and each one has its own budget. ([Troubleshoot 429 errors](https://learn.microsoft.com/azure/cosmos-db/troubleshoot-request-rate-too-large))

The average hides the problem. The whole container might sit at 35%, while partition A is at 100% and partitions B and C are at 28% and 20%.

### Free capacity elsewhere does not help a hot partition

Take a container with manual throughput of 20,000 RU/s and four physical partitions. Each partition gets 5,000 RU/s.

| Partition | Needs | Gets | Result |
| --- | --- | --- | --- |
| A (hot) | 8,000 RU/s | 5,000 RU/s | 429 / throttling |
| B, C, D | 1,000 RU/s each | 5,000 RU/s each | 4,000 RU/s unused each |

Total demand is only 11,000 RU/s, but A still gets throttled, because unused RU/s on B, C and D cannot be lent to it. To give A 8,000 RU/s, you have to raise the container to 32,000 RU/s, which raises B, C and D too. That is **60% more throughput cost** (storage is billed separately). You don't pay for the hot partition itself; you pay for the uneven distribution.

Before you add RU/s, check:

- **Normalized RU Consumption** split by PartitionKeyRangeID. One range at 100% while the rest sit low points to a hot partition. ([Monitor normalized RU](https://learn.microsoft.com/azure/cosmos-db/monitor-normalized-request-units))
- How many requests actually end in 429. The SDKs retry automatically, and Microsoft says 1 to 5% of requests with 429 is a healthy sign if end-to-end latency is acceptable.
- Your p95/p99 latency, not just the average.

Autoscale does not remove this problem: a single logical partition is still limited to 10,000 RU/s.

### The partition key is a financial decision

A key with few values, like `/status`, concentrates traffic and creates hot partitions. A key like `/tenantId` can be a better start if most queries and traffic naturally belong to one tenant, but watch your largest tenant as it grows. ([Partitioning](https://learn.microsoft.com/azure/cosmos-db/partitioning))

The partition key does not change the price per RU. It changes two different costs:

1. **Capacity distribution: how many RU/s do you need to buy?** Even traffic uses the RU/s you bought. A hot partition makes you buy capacity that sits idle elsewhere.
2. **RU cost per operation: how much work does a request take?** A query with the partition key usually costs less than one that fans out to every partition. A point read (`id` + partition key) is the most direct path to a document. ([Optimize cost of reads and writes](https://learn.microsoft.com/azure/cosmos-db/optimize-cost-reads-writes))

One catch: with manual throughput, **fewer RUs used does not mean a smaller bill**. The saving only shows up when you measure the workload again and lower the provisioned RU/s, while keeping room for peaks and your latency targets.

## Cost control is part of production architecture

Cost control does not start when the invoice arrives. It belongs in how you monitor production, next to latency and errors. The loop is simple: **measure, explain, optimize, resize**.

Start from one business operation, for example "show an order", and follow it through four signals:

| Signal | What it tells you |
| --- | --- |
| [Request charge](https://learn.microsoft.com/azure/cosmos-db/find-request-unit-charge) | How many RUs the operation costs |
| [Normalized RU Consumption](https://learn.microsoft.com/azure/cosmos-db/monitor-normalized-request-units) by region and partition | Where the bottleneck is (it is the max across partitions, not an average) |
| 429 count and p95/p99 latency | What the load means for your users and your SLO |
| [Cost Management](https://learn.microsoft.com/azure/cost-management-billing/costs/quick-acm-cost-analysis) | The real bill (cost data can lag by several hours) |

Also remember that an [Azure budget](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets) sends alerts, but on its own it does not stop resources or spending.

The goal is not just a cheaper database. I want to know what showing an order costs, not only what the database costs.

## When does Cosmos DB make sense?

The value of a distributed database must be greater than its total cost. Cosmos DB is a good **candidate** when you have:

- global operational data where local access has measurable value,
- many reads and writes that spread well across a partition key,
- a document model with known, dominant access patterns,
- scaling and replication that business goals actually justify.

Examples: global user profiles, session or game state, device state, global order status. Candidates, not automatic recommendations.

For other problems, something simpler often fits better:

| Need | Usually a better fit |
| --- | --- |
| Relations, financial data, JOINs, transactions | Azure SQL |
| Moderate traffic and ad hoc queries | Azure SQL |
| Original JSON, PDFs, images, archive | Blob Storage |
| Metadata plus large content | SQL or Cosmos DB for queries, Blob for content |
| Audit logs and analytics over files | ADLS Gen2 + Azure Data Explorer |

### Five questions before production

1. Do we need the distribution and scaling we are paying for?
2. Do we know our dominant operations and their measured RU?
3. Will the partition key survive the growth of our largest tenant?
4. Does the capacity model (manual, autoscale or serverless) match traffic over time?
5. Did we compare Azure SQL and Blob Storage against the same requirements?

## Takeaway

Don't optimize only the RUs. Optimize the decision. Measure the business operation first, then choose the data and capacity model, and only then look at how much you saved.

Global distribution is a business capability you have to justify, not a checkbox you turn on because it exists. JSON is a format, not an architectural requirement. Good architecture knows why it uses this particular database.

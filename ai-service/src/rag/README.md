# RAG package

This package separates retrieval-augmented generation responsibilities:

- `models/` — shared data models for documents, retrieval results, and answers.
- `ingestion/` — document loading, processing, and indexing.
- `retrieval/` — search and context selection.
- `generation/` — answer generation using retrieved context.

Keep orchestration and shared RAG configuration in this package as the pipeline
is implemented.

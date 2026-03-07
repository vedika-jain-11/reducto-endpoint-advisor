import { useState, useRef } from "react";

const P = "#9b30ff";
const PL = "#f3e8ff";
const PB = "#eddcff";
const TX = "#1a1a1a";
const TX2 = "#666";
const TX3 = "#999";
const BG = "#fff";
const BD = "#e5e5e5";
const BDL = "#f7f7f7";

const ENDPOINTS = {
  parse: { name: "Parse", desc: "Extract all content — text, tables, figures — with layout-aware chunking. The base layer for any downstream workflow.", docs: "docs.reducto.ai/parse/overview" },
  extract: { name: "Extract", desc: "Pull specific fields into structured JSON using a natural language schema. Define what you want, get exactly that.", docs: "docs.reducto.ai/extract/overview" },
  split: { name: "Split", desc: "Divide long or multi-document files into individually useful sections using natural language descriptions.", docs: "docs.reducto.ai/split" },
  edit: { name: "Edit", desc: "Fill PDF forms, tables, and checkboxes or edit DOCX files programmatically. Write data back into documents.", docs: "docs.reducto.ai/editing/edit-overview" },
};

const CASE_STUDIES = [
  { id: "vanta-questionnaire", customer: "Vanta", vertical: "Compliance", title: "Security Questionnaire Automation", summary: "Automate B2B security questionnaires: parse the questionnaire + supporting docs, extract questions, AI generates answers, fill completed answers back into the original document preserving formatting.", pipeline: ["parse", "extract", "edit"], result: "Prototype to production in ~1 month. Replaced AWS Textract.", quote: "We ran a side-by-side comparison. Reducto's quality was higher, and it was faster.", quotee: "Ignacio Andreu, Head of Vanta AI" },
  { id: "vanta-evidence", customer: "Vanta", vertical: "Compliance", title: "Evidence Evaluation Loop", summary: "Automated compliance evidence validation: parse screenshots and documents, extract relevant data, evaluate completeness, iterate until evidence meets auditor requirements. Used as a feedback loop for other AI agents.", pipeline: ["parse", "extract"], result: "Internal platform powering multiple Vanta AI products.", quote: "It's a feature for the other agents to have a feedback loop.", quotee: "Ignacio Andreu, Head of Vanta AI" },
  { id: "benchmark-docbuilder", customer: "Benchmark", vertical: "Finance", title: "Investment Document Builder", summary: "Generate investment memos and IC materials from deal documents. Parse all reference files (presentations, Excel models, contracts), produce citation-ready chunks, AI generates documents with every claim linked to its source.", pipeline: ["parse", "extract"], result: "IC material creation: 1 week → under 2 hours. 3.5M+ pages/year.", quote: "Reducto provides best-in-class chunks, which often require no post-processing.", quotee: "Connor Jansen, Co-founder of Benchmark" },
  { id: "benchmark-ingestion", customer: "Benchmark", vertical: "Finance", title: "Automated Deal Document Ingestion", summary: "Fully automated pipeline: deal documents from uploads + forwarded emails are automatically processed, chunked, and routed. Handles messy Excel spreadsheets that break other vendors.", pipeline: ["parse", "split"], result: "Team of 6 processing 3.5M+ pages/year with no manual overhead.", quote: "I just don't need to worry about a customer onboarding spiking our document processing volume.", quotee: "Connor Jansen, Co-founder of Benchmark" },
  { id: "benchmark-data", customer: "Benchmark", vertical: "Finance", title: "First-Party Data Engine", summary: "Build proprietary institutional datasets from every deal — closed or not. Parse and extract structured data from all documents, normalize across deals, enable portfolio-level queries and analytics over time.", pipeline: ["parse", "extract"], result: "Proprietary datasets across firms managing ~$1T AUM.", quote: "A really rich first-party data set specific to that firm, allowing them to constantly learn and compete.", quotee: "Connor Jansen, Co-founder of Benchmark" },
  { id: "scale-donovan", customer: "Scale AI", vertical: "Government / Defense", title: "Donovan: Agentic RAG for Public Sector", summary: "Scale's Donovan platform deploys mission-tailored AI agents for government and defense. Reducto parses complex government documents — official orders, situation reports, intelligence briefs with handwriting, charts, and low-quality scans — into clean chunks for RAG.", pipeline: ["parse"], result: "Replaced homegrown stack. Runs in air-gapped, on-prem environments.", quote: "Reducto is very easy to use as a plug-and-play tool where we're able to tailor it very quickly for each workflow.", quotee: "Shourya Munjal, Software Engineer, Scale AI" },
  { id: "scale-enterprise", customer: "Scale AI", vertical: "Enterprise AI", title: "Enterprise Document Processing at Scale", summary: "Scale's Enterprise team uses Reducto to handle bespoke document workflows across diverse customer contracts. Previously required one-off solutions per document type; Reducto provides a unified foundation across all formats with on-prem deployment.", pipeline: ["parse", "extract"], result: "Unified pipeline replaced ad-hoc per-document-type solutions.", quote: "Time and again Reducto has proven to be a trusted partner that we can depend on.", quotee: "Kyra Huneycutt, Product Manager, Scale's Donovan" },
  { id: "anterior-priorauth", customer: "Anterior", vertical: "Healthcare", title: "Prior Authorization Automation", summary: "Anterior processes prior authorization workflows for health insurers. Reducto ingests unstructured medical records — scanned PDFs, handwritten notes, fragmented patient histories — and extracts structured clinical data with sentence-level bounding boxes for citation and audit trails.", pipeline: ["parse", "extract"], result: "99.24% extraction accuracy. <0.1% ingestion errors. 95% of reviews under 1-minute SLA.", quote: "Reducto helped us unlock the last mile of tough documents that gave us the competitive edge we needed.", quotee: "Anterior Engineering Team" },
  { id: "august-discovery", customer: "August", vertical: "Legal", title: "Legal Discovery & Privilege Review", summary: "August builds attorney-ready legal workflows. Reducto parses massive discovery productions — emails, spreadsheets, scans, multilingual documents, irregular PDFs — with bounding boxes so lawyers can verify every citation back to the source.", pipeline: ["parse", "extract"], result: "Full rip-and-replace of upload pipeline. Unlocked multilingual and scanned doc support.", quote: "Reducto helped us unlock the last mile of tough legal documents that gave us the competitive edge we needed.", quotee: "Dominic Lee, Founding Engineer, August" },
  { id: "stack-dataroom", customer: "Stack AI", vertical: "Automation Platform", title: "Data Room Agent for M&A Due Diligence", summary: "Stack AI's no-code platform lets anyone build AI agents. Their Data Room Agent uses Reducto to parse and extract data from deal documents that are often incomplete or poorly organized. Outputs feed LLMs with citations and structured data.", pipeline: ["parse", "extract"], result: "5M+ documents processed. Industry-agnostic across finance, healthcare, legal, defense.", quote: "Reducto strikes a very good balance — a system that is very reliable and of very high quality.", quotee: "Bernard Aceituno, Co-Founder of Stack AI" },
  { id: "stack-knowledgebase", customer: "Stack AI", vertical: "Automation Platform", title: "Knowledge Base & RAG Workflows", summary: "Stack AI customers dump hundreds of messy documents to build knowledge bases, search workflows, and chatbots. Reducto handles the ingestion layer — parsing receipts, handwritten claims, screenshots that broke other OCR vendors.", pipeline: ["parse"], result: "Foundational parsing layer powering all Stack AI document workflows.", quote: "When we discovered Reducto, we found it was the most flexible, easiest, and straightforward to work with complex data.", quotee: "Bernard Aceituno, Co-Founder of Stack AI" },
  { id: "lea-ria", customer: "LEA", vertical: "Finance / Wealth Management", title: "RIA Document Organization & Data Extraction", summary: "LEA automates document processing for RIAs managing $10B+ in assets. Reducto parses brokerage statements, tax returns, trust materials — extracting structured data that LEA uses to auto-rename, organize, and generate CSV exports for planning systems.", pipeline: ["parse", "extract", "split"], result: "50% less manual data entry. 5 hrs/client/month saved. 65% QoQ growth. 3-person team.", quote: "With Reducto, we found high accuracy, fast performance, and zero data sharing. Integration took less than a week.", quotee: "Chuck Blake, Co-founder & CTO of LEA" },
  { id: "gumloop-workflows", customer: "Gumloop", vertical: "Automation Platform", title: "No-Code AI Workflow Builder with PDF Parsing", summary: "Gumloop is a drag-and-drop AI workflow builder used by teams at Instacart and Webflow. Reducto powers their 'advanced PDF reading' node, enabling non-technical users to build automations that parse documents from Google Drive, Gmail, and more.", pipeline: ["parse"], result: "Powers all advanced PDF parsing across Gumloop. Team of 8 (4 engineers).", quote: "I don't think about Reducto at all — in the best way possible. It just works. It's perfect.", quotee: "Max Brodeur-Urbas, Founder of Gumloop" },
];

const EXAMPLES = [
  "I need to extract transaction data from thousands of bank statement PDFs",
  "We get multi-document insurance claim packets and need to separate, classify, and extract key fields",
  "I want to build a RAG pipeline over our internal knowledge base of scanned contracts",
  "We receive security questionnaires and need to auto-fill them with answers from our compliance docs",
  "We need to process prior authorization requests from medical records and scanned notes",
  "Our legal team runs discovery on hundreds of thousands of documents and needs citations",
  "We have deal room folders with mixed PDFs, Excel files, and presentations that need to be searchable",
  "I need to process government documents including handwritten forms and low-quality scans in a secure environment",
  "We want to extract and normalize financial data from client documents for our wealth management platform",
];

const SYS = `You are a Reducto API endpoint advisor. Given a user's document processing use case described in natural language, recommend which Reducto API endpoints they should use and in what order.

Reducto has 4 core endpoints:

1. **Parse** - Extract all content from documents (text, tables, figures, images) with layout-aware chunking. Produces clean, structured output with bounding boxes and confidence scores. Supports PDFs, images, spreadsheets, slides, and 30+ formats. Features Agentic OCR (multi-pass self-correction), table extraction, figure summarization, and multilingual support (100+ languages). This is the base layer — most workflows start here.

2. **Extract** - Pull specific fields into structured JSON using a natural language schema. You define what fields you want (e.g., "invoice_number", "total_amount", "vendor_name") and get exactly that back with citations. Best for: invoice processing, form data extraction, financial metrics, contract clause extraction, any use case where you need specific typed fields.

3. **Split** - Divide long documents or multi-document files into individually useful sections. Uses natural language descriptions to identify boundaries. Best for: document packets/binders, separating mixed files, batch processing, creating clean boundaries before downstream processing.

4. **Edit** - Fill PDF forms, tables, and checkboxes. Edit DOCX files programmatically. Write data BACK into documents. No bounding boxes or templates required — it dynamically identifies fillable elements. Best for: form filling, questionnaire completion, document generation, any "write-back" workflow.

Common pipeline patterns:
- RAG/Search: Parse (→ vector DB)
- Data extraction: Parse → Extract
- Form automation: Parse → Extract → Edit
- Document processing at scale: Split → Parse → Extract
- Mixed document packets: Split → Parse → Extract

Real customer examples to inform your recommendations:
- Vanta (Compliance): Parse → Extract → Edit for security questionnaire automation
- Benchmark (Finance): Parse → Extract for investment memo generation with citations
- Scale AI (Gov/Defense): Parse for RAG over classified government documents in air-gapped environments
- Anterior (Healthcare): Parse → Extract for prior authorization with 99.24% accuracy
- August (Legal): Parse → Extract for litigation discovery and privilege review
- Stack AI (Automation): Parse → Extract for M&A data room agents
- LEA (Wealth Mgmt): Parse → Extract → Split for RIA financial document automation
- Gumloop (Automation): Parse for no-code AI workflow builder

Respond in this EXACT JSON format with no other text, no markdown, no backticks:
{"endpoints":[{"name":"parse|extract|split|edit","reason":"1-2 sentence explanation of why this endpoint is needed for this specific use case"}],"pipeline_summary":"1-2 sentence summary of the full recommended pipeline and what it achieves","complexity":"simple|moderate|complex","tip":"One practical tip specific to their use case, referencing a Reducto feature or configuration option that would help","matched_case_studies":["id1","id2"]}

For matched_case_studies, return 1-3 case study IDs from this list that have the MOST SIMILAR workflow pattern or industry to the user's use case. Only include genuinely relevant matches — if nothing is close, return an empty array. Do NOT match just because they share the Parse endpoint (everything uses Parse). Match on workflow shape, industry, or problem type.

Available IDs: vanta-questionnaire, vanta-evidence, benchmark-docbuilder, benchmark-ingestion, benchmark-data, scale-donovan, scale-enterprise, anterior-priorauth, august-discovery, stack-dataroom, stack-knowledgebase, lea-ria, gumloop-workflows`;

function Chip({ id, small }) {
  const ep = ENDPOINTS[id];
  if (!ep) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: small ? "3px 10px" : "5px 14px", borderRadius: 20,
      background: PL, color: P,
      fontSize: small ? 12 : 13, fontWeight: 600,
      fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap",
    }}>{ep.name}</span>
  );
}

function CaseCard({ study, isMatch }) {
  return (
    <div style={{
      background: BG, border: `1px solid ${isMatch ? P : BD}`,
      borderRadius: 8, padding: "20px 22px",
      boxShadow: isMatch ? `0 0 0 1px ${P}22` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TX }}>{study.title}</div>
          <div style={{ fontSize: 13, color: TX3, marginTop: 2 }}>{study.customer} · {study.vertical}</div>
        </div>
        {isMatch && (
          <span style={{ fontSize: 11, fontWeight: 600, color: P, background: PL, padding: "3px 10px", borderRadius: 20 }}>Similar pipeline</span>
        )}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: TX2, margin: "0 0 14px 0" }}>{study.summary}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {study.pipeline.map((ep, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Chip id={ep} small />
            {i < study.pipeline.length - 1 && <span style={{ color: TX3, fontSize: 13 }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: P, fontWeight: 600, marginBottom: 10 }}>{study.result}</div>
      <div style={{ fontSize: 13, color: TX3, fontStyle: "italic", borderTop: `1px solid ${BDL}`, paddingTop: 10 }}>
        "{study.quote}" — <span style={{ fontStyle: "normal", fontWeight: 500, color: TX2 }}>{study.quotee}</span>
      </div>
    </div>
  );
}

export default function ReductoAdvisor() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matched, setMatched] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);

  const findMatches = (parsed) => {
    const ids = parsed.matched_case_studies || [];
    return CASE_STUDIES.filter(s => ids.includes(s.id));
  };

  const submit = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setResult(null); setMatched([]); setShowAll(false);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), system: SYS }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setMatched(findMatches(parsed));
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) { console.error(e); setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TX, fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Source+Sans+3:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${BD}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <svg width="105" height="24" viewBox="0 0 210 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 4C0 1.79 1.79 0 4 0H28C30.21 0 32 1.79 32 4V34L22 44H4C1.79 44 0 42.21 0 40V4Z" fill="#A020D0"/>
            <path d="M22 34V44L32 34H22Z" fill="#7B18A0"/>
            <rect x="8" y="8" width="16" height="28" rx="2" fill="white"/>
            <text x="42" y="36" fontFamily="system-ui, -apple-system, sans-serif" fontSize="34" fontWeight="800" fill="#141428" letterSpacing="-0.5">reducto</text>
          </svg>
        </div>
        <span style={{ fontSize: 13, color: TX3 }}>Endpoint Advisor</span>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "64px 24px 0" }}>
        <h1 style={{
          fontFamily: "'Source Serif 4', serif", fontSize: 46, fontWeight: 700,
          lineHeight: 1.12, margin: "0 0 16px 0", color: TX, textAlign: "center",
          letterSpacing: "-0.02em",
        }}>
          Describe your workflow.<br/>Get your <span style={{ color: P }}>pipeline</span>.
        </h1>
        <p style={{ fontSize: 17, color: TX2, textAlign: "center", lineHeight: 1.55, margin: "0 auto 40px", maxWidth: 560 }}>
          Reducto's four API endpoints cover the full document lifecycle. Tell us what you're building and we'll map it to the right endpoints — with real customer examples.
        </p>

        {/* Input */}
        <div style={{ border: `1.5px solid ${BD}`, borderRadius: 10, padding: "20px", background: BG }}>
          <textarea
            value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="e.g., We process thousands of insurance claim packets monthly — need to separate each doc, extract claim number, date of loss, and provider, then auto-fill our internal form..."
            rows={3}
            style={{
              width: "100%", background: "transparent", border: "none", color: TX,
              fontSize: 16, lineHeight: 1.6, resize: "none", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 13, color: TX3 }}>Enter ↵ to submit</span>
            <button onClick={submit} disabled={loading || !query.trim()} style={{
              padding: "10px 28px", borderRadius: 6, border: "none",
              background: loading ? "#ccc" : P, color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer",
              fontFamily: "inherit", opacity: !query.trim() ? 0.5 : 1, transition: "all 0.2s",
            }}>
              {loading ? "Analyzing..." : "Map to endpoints →"}
            </button>
          </div>
        </div>

        {/* Examples */}
        {!result && !loading && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 13, color: TX3, marginBottom: 10, fontWeight: 500 }}>Try a common workflow:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => { setQuery(ex); setResult(null); setMatched([]); }}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    border: `1px solid ${BD}`, background: BG, color: TX2,
                    fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", lineHeight: 1.4, transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = P; e.target.style.color = P; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = BD; e.target.style.color = TX2; }}
                >{ex}</button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "56px 20px", color: TX3 }}>
            <div style={{
              width: 32, height: 32, border: `3px solid ${BDL}`, borderTopColor: P,
              borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.7s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: 15 }}>Mapping to endpoints...</div>
          </div>
        )}

        {error && (
          <div style={{ padding: "16px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 14, marginTop: 24 }}>{error}</div>
        )}

        {/* Results */}
        {result && (
          <div ref={ref} style={{ marginTop: 40, animation: "fadeUp 0.35s ease" }}>
            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ border: `1px solid ${BD}`, borderRadius: 10, padding: "28px 26px", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ margin: 0, fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 700, color: TX }}>
                  Your pipeline
                </h2>
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                  background: result.complexity === "simple" ? "#ecfdf5" : result.complexity === "moderate" ? "#fffbeb" : "#fef2f2",
                  color: result.complexity === "simple" ? "#059669" : result.complexity === "moderate" ? "#d97706" : "#dc2626",
                }}>{result.complexity}</span>
              </div>

              <div style={{
                display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                marginBottom: 20, padding: "16px 18px", background: BDL, borderRadius: 8,
              }}>
                {result.endpoints.map((ep, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Chip id={ep.name} />
                    {i < result.endpoints.length - 1 && <span style={{ color: TX3, fontSize: 16, fontWeight: 500 }}>→</span>}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.65, color: TX2, margin: "0 0 22px 0" }}>{result.pipeline_summary}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {result.endpoints.map((ep, i) => {
                  const meta = ENDPOINTS[ep.name];
                  if (!meta) return null;
                  return (
                    <div key={i} style={{
                      display: "flex", gap: 14, padding: "14px 16px",
                      borderRadius: 8, background: BDL, border: `1px solid ${BD}`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: PL,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, color: P, flexShrink: 0,
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: TX }}>{meta.name}</span>
                          <span style={{ fontSize: 12, color: TX3, fontFamily: "'IBM Plex Mono', monospace" }}>{meta.docs}</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: TX2, margin: 0 }}>{ep.reason}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {result.tip && (
                <div style={{
                  marginTop: 16, padding: "12px 16px", background: PL,
                  border: `1px solid ${PB}`, borderRadius: 8,
                  fontSize: 14, lineHeight: 1.6, color: TX2,
                }}>
                  <span style={{ color: P, fontWeight: 700, marginRight: 6 }}>Tip:</span>{result.tip}
                </div>
              )}
            </div>

            {matched.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 700, color: TX, marginBottom: 14 }}>
                  Customers with similar pipelines
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {matched.map(s => <CaseCard key={s.id} study={s} isMatch />)}
                </div>
              </div>
            )}

            <button onClick={() => setShowAll(!showAll)} style={{
              width: "100%", padding: "12px", borderRadius: 8,
              border: `1px solid ${BD}`, background: BG, color: TX2,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              textAlign: "center",
            }}>
              {showAll ? "Hide" : "Browse"} all customer pipelines ({CASE_STUDIES.length})
            </button>

            {showAll && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
                {CASE_STUDIES.filter(s => !matched.find(m => m.id === s.id)).map(s => <CaseCard key={s.id} study={s} isMatch={false} />)}
              </div>
            )}
          </div>
        )}

        {/* Endpoint reference */}
        {!result && !loading && (
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${BD}` }}>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 700, color: TX, marginBottom: 6 }}>
              Four endpoints. Full document <span style={{ color: P }}>lifecycle</span>.
            </h3>
            <p style={{ fontSize: 14, color: TX3, marginBottom: 20 }}>Parse, extract, split, and edit — each can be used alone or chained together.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {Object.entries(ENDPOINTS).map(([id, ep]) => (
                <div key={id} style={{
                  border: `1px solid ${BD}`, borderRadius: 8, padding: "18px",
                  background: BG, transition: "border-color 0.15s", cursor: "default",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = P}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = BD}
                >
                  <Chip id={id} />
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: TX2, margin: "10px 0 0 0" }}>{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          marginTop: 48, paddingTop: 20, paddingBottom: 40,
          borderTop: `1px solid ${BD}`, fontSize: 13, color: TX3, lineHeight: 1.5,
        }}>
          Built from published case studies and documentation. Recommendations are AI-generated — validate against <span style={{ color: P }}>docs.reducto.ai</span>.
        </div>
      </div>
    </div>
  );
}

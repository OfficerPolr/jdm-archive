const state = { brochures: [], brand: "", year: "", query: "" };
const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const unique = (values) => [...new Set(values)].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
const normalize = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

async function init(){
  $("current-year").textContent = new Date().getFullYear();
  try {
    const response = await fetch("data/brochures.json");
    if(!response.ok) throw new Error("Could not load catalogue");
    const data = await response.json();
    state.brochures = data.brochures || [];
    populateFilters();
    render();
  } catch(error) {
    $("results-count").textContent = "Catalogue could not be loaded.";
    $("brochure-grid").innerHTML = `<p class="error-message">${escapeHtml(error.message)}. Check that data/brochures.json exists.</p>`;
  }
}
function populateFilters(){
  const brands = unique(state.brochures.map(b=>b.brand));
  const years = unique(state.brochures.map(b=>b.year)).sort((a,b)=>Number(b)-Number(a));
  brands.forEach(brand => $("brand-filter").add(new Option(brand,brand)));
  years.forEach(year => $("year-filter").add(new Option(year,year)));
  $("brand-strip").innerHTML = `<button class="brand-chip active" data-brand="">ALL MAKES</button>` +
    brands.map(b=>`<button class="brand-chip" data-brand="${escapeHtml(b)}">${escapeHtml(b.toUpperCase())}</button>`).join("");
  $("brand-strip").addEventListener("click",e=>{
    const button=e.target.closest("[data-brand]"); if(!button)return;
    state.brand=button.dataset.brand; $("brand-filter").value=state.brand; render();
  });
}
function filtered(){
  return state.brochures.filter(b=>{
    const haystack=normalize([b.brand,b.model,b.generation,b.year,b.market,b.language,b.type].join(" "));
    return (!state.brand||b.brand===state.brand)&&(!state.year||String(b.year)===state.year)&&(!state.query||haystack.includes(normalize(state.query)));
  }).sort((a,b)=>Number(b.year)-Number(a.year)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
}
function render(){
  const items=filtered();
  $("results-count").textContent=`SHOWING ${items.length} OF ${state.brochures.length} BROCHURES`;
  $("stat-brochures").textContent=state.brochures.length.toLocaleString();
  $("stat-brands").textContent=unique(state.brochures.map(b=>b.brand)).length.toLocaleString();
  const years=state.brochures.map(b=>Number(b.year)).filter(Number.isFinite);
  $("stat-years").textContent=years.length?`${Math.min(...years)}–${Math.max(...years)}`:"—";
  document.querySelectorAll(".brand-chip").forEach(el=>el.classList.toggle("active",el.dataset.brand===state.brand));
  $("brochure-grid").innerHTML=items.map(b=>`
    <article class="brochure-card" tabindex="0" role="button" data-id="${escapeHtml(b.id)}" aria-label="View ${escapeHtml(b.brand)} ${escapeHtml(b.model)} ${escapeHtml(b.year)}">
      <div class="cover-wrap"><img src="${escapeHtml(b.cover)}" alt="${escapeHtml(b.brand)} ${escapeHtml(b.model)} brochure cover" loading="lazy"><span class="cover-year">${escapeHtml(b.year)}</span></div>
      <div class="card-meta"><h3 class="card-model">${escapeHtml(b.model)}</h3><div class="card-sub">${escapeHtml(b.brand.toUpperCase())}${b.generation?` · ${escapeHtml(b.generation)}`:""} · ${escapeHtml(b.market||"Japan")}</div><div class="card-bottom"><span>${escapeHtml(b.type||"BROCHURE")}</span><span class="pdf-tag">PDF ↗</span></div></div>
    </article>`).join("");
  $("empty-state").hidden=items.length!==0;
  $("brochure-grid").hidden=items.length===0;
}
function openBrochure(id){
  const b=state.brochures.find(item=>item.id===id); if(!b)return;
  const hasPdf=Boolean(b.pdfUrl);
  $("dialog-content").innerHTML=`
    <div class="dialog-layout">
      <img class="dialog-cover" src="${escapeHtml(b.cover)}" alt="${escapeHtml(b.model)} brochure cover">
      <div class="dialog-info">
        <p class="dialog-kicker">${escapeHtml(b.brand.toUpperCase())} / ${escapeHtml(b.year)}</p>
        <h2>${escapeHtml(b.model)}</h2>
        <p class="dialog-description">${escapeHtml(b.description||"Original automotive brochure in the JDM Archive collection.")}</p>
        <dl class="detail-list">
          <dt>Manufacturer</dt><dd>${escapeHtml(b.brand)}</dd>
          <dt>Model</dt><dd>${escapeHtml(b.model)}</dd>
          <dt>Generation</dt><dd>${escapeHtml(b.generation||"Not specified")}</dd>
          <dt>Year</dt><dd>${escapeHtml(b.year)}</dd>
          <dt>Market</dt><dd>${escapeHtml(b.market||"Japan")}</dd>
          <dt>Language</dt><dd>${escapeHtml(b.language||"Japanese")}</dd>
          <dt>Format</dt><dd>${escapeHtml(b.type||"Brochure")} · PDF</dd>
        </dl>
        ${hasPdf?`<div class="action-row"><a class="action-button" href="${escapeHtml(b.pdfUrl)}" target="_blank" rel="noopener">OPEN PDF ↗</a><a class="action-button secondary" href="${escapeHtml(b.pdfUrl)}" download>DOWNLOAD PDF ↓</a></div>`:`<div class="placeholder-note">SAMPLE CATALOGUE ENTRY — No PDF has been connected yet. Add the PDF's public GitHub Release URL to this entry in <code>data/brochures.json</code>.</div>`}
      </div>
    </div>`;
  $("brochure-dialog").showModal();
}
$("brochure-grid").addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openBrochure(card.dataset.id)});
$("brochure-grid").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openBrochure(e.target.dataset.id)}});
$("dialog-close").addEventListener("click",()=>$("brochure-dialog").close());
$("brochure-dialog").addEventListener("click",e=>{if(e.target===$("brochure-dialog"))$("brochure-dialog").close()});
$("search").addEventListener("input",e=>{state.query=e.target.value;render()});
$("brand-filter").addEventListener("change",e=>{state.brand=e.target.value;render()});
$("year-filter").addEventListener("change",e=>{state.year=e.target.value;render()});
$("clear-filters").addEventListener("click",()=>{state.brand="";state.year="";state.query="";$("search").value="";$("brand-filter").value="";$("year-filter").value="";render()});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)&&!$("brochure-dialog").open){e.preventDefault();$("search").focus()}});
init();

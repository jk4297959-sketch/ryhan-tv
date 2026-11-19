import './style.css';

const demoVideo = {
  id: 'bbb',
  title: 'Big Buck Bunny',
  category: 'Movies',
  kind: 'movie',
  description: 'A well-known open movie released under the Creative Commons Attribution 3.0 license. Demo stream; check the source license before redistribution.',
  poster: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
  url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  source: 'Blender Open Movie'
};

const catalog = [
  demoVideo,
  {id:'sintel',title:'Sintel',category:'Movies',kind:'movie',description:'Open movie by the Blender Foundation. Creative Commons licensed.',poster:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sintel_poster.jpg/600px-Sintel_poster.jpg',url:'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',source:'Blender Open Movie'},
  {id:'tears',title:'Tears of Steel',category:'Movies',kind:'movie',description:'Open movie by the Blender Foundation. Creative Commons licensed.',poster:'https://mango.blender.org/wp-content/uploads/2013/05/01_thom_celia_bridge.jpg',url:'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',source:'Blender Open Movie'},
  {id:'elephants',title:'Elephants Dream',category:'Movies',kind:'movie',description:'An open movie from the Blender Foundation. Verify current license terms at the source.',poster:'https://orange.blender.org/wp-content/themes/orange/images/media/gallery/s1_proog.jpg',url:'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',source:'Blender Open Movie'}
];

const channels = [
  {id:'add-channel',title:'Add a legal live channel',category:'Live TV',kind:'live',description:'Paste an official public HLS (.m3u8) or MP4 stream URL that you are authorized to use.',poster:'',url:'',source:'Your authorized stream'}
];

let activeCategory = 'All';
let favorites = JSON.parse(localStorage.getItem('ryhan-favorites') || '[]');
let userStreams = JSON.parse(localStorage.getItem('ryhan-streams') || '[]');
let currentItem = null;

const app = document.querySelector('#app');
const allItems = () => [...catalog, ...userStreams, ...channels];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function render() {
  app.innerHTML = `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">▶</span><span>RYHAN <b>TV</b></span></div>
      <button class="icon-btn" id="searchToggle" aria-label="Search">⌕</button>
    </header>
    <main>
      <section class="hero">
        <div class="hero-copy"><span class="eyebrow">FREE • LEGAL • ENTERTAINMENT</span><h1>Watch something<br><em>good.</em></h1>
        <p>Discover free videos and add live streams you are authorized to watch.</p>
        <button class="primary" id="playFeatured">▶ &nbsp; Play demo</button></div>
        <div class="hero-glow"></div>
      </section>
      <div class="search-wrap hidden" id="searchWrap"><input id="searchInput" placeholder="Search movies and channels..." /></div>
      <nav class="tabs">${['All','Movies','Live TV','My List'].map(c=>`<button class="tab ${activeCategory===c?'selected':''}" data-cat="${c}">${c}</button>`).join('')}</nav>
      <section class="section">
        <div class="section-head"><h2>${activeCategory==='All'?'Explore':esc(activeCategory)}</h2><span>${activeCategory==='My List'?'Saved titles':'Free collection'}</span></div>
        <div class="grid" id="catalogGrid"></div>
      </section>
      <section class="section add-section">
        <div class="section-head"><h2>Add a channel</h2><span>Use official stream links only</span></div>
        <div class="add-form">
          <input id="streamName" placeholder="Channel name (e.g. My local TV)" />
          <input id="streamUrl" placeholder="Official HLS .m3u8 or MP4 URL" inputmode="url" />
          <input id="streamPoster" placeholder="Poster image URL (optional)" inputmode="url" />
          <button class="primary" id="addStream">＋ Add channel</button>
        </div>
        <p class="fineprint">RYHAN TV does not provide paid-channel credentials or unauthorized Netflix, sports, or premium streams. Add only streams published for free public viewing or streams you have permission to use.</p>
      </section>
    </main>
    <footer>RYHAN TV <span>Independent app • Not affiliated with Netflix or broadcasters</span></footer>
    <div class="modal hidden" id="playerModal">
      <div class="player-panel"><button class="close" id="closePlayer">✕</button><video id="video" controls playsinline></video><div class="player-info"><h2 id="playerTitle"></h2><p id="playerDesc"></p><small id="playerSource"></small></div></div>
    </div>
    <div class="toast" id="toast"></div>
  `;
  renderGrid();
  document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{activeCategory=b.dataset.cat;render();}));
  document.querySelector('#searchToggle').onclick=()=>{document.querySelector('#searchWrap').classList.toggle('hidden');document.querySelector('#searchInput')?.focus();};
  document.querySelector('#searchInput').oninput=renderGrid;
  document.querySelector('#playFeatured').onclick=()=>play(demoVideo);
  document.querySelector('#addStream').onclick=addStream;
  document.querySelector('#closePlayer').onclick=closePlayer;
  document.querySelector('#playerModal').onclick=e=>{if(e.target.id==='playerModal')closePlayer();};
}

function renderGrid() {
  const grid=document.querySelector('#catalogGrid'); if(!grid)return;
  const q=(document.querySelector('#searchInput')?.value||'').toLowerCase();
  let items=allItems().filter(x=>x.id!=='add-channel');
  if(activeCategory==='Movies') items=items.filter(x=>x.kind==='movie');
  else if(activeCategory==='Live TV') items=items.filter(x=>x.kind==='live');
  else if(activeCategory==='My List') items=items.filter(x=>favorites.includes(x.id));
  items=items.filter(x=>(x.title+' '+x.category).toLowerCase().includes(q));
  if(!items.length){grid.innerHTML='<p class="empty">Nothing here yet. Add an authorized stream or save a title.</p>';return;}
  grid.innerHTML=items.map(x=>`
    <article class="tile">
      <button class="poster" data-play="${esc(x.id)}" style="${x.poster?`background-image:linear-gradient(0deg,#090b10aa,transparent),url('${esc(x.poster)}')`:''}">
        ${!x.poster?'<span class="live-icon">LIVE</span>':''}
        <span class="play-bubble">▶</span><span class="kind">${esc(x.category)}</span>
      </button>
      <div class="tile-meta"><div><h3>${esc(x.title)}</h3><p>${esc(x.source||'Free stream')}</p></div><button class="save ${favorites.includes(x.id)?'saved':''}" data-save="${esc(x.id)}" aria-label="Save">♥</button></div>
    </article>`).join('');
  grid.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{const item=allItems().find(x=>x.id===b.dataset.play);if(item)play(item);});
  grid.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{const id=b.dataset.save;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem('ryhan-favorites',JSON.stringify(favorites));renderGrid();});
}

function play(item) {
  if(!item.url){toast('This channel has no stream URL yet. Add an authorized stream below.');return;}
  currentItem=item;
  const modal=document.querySelector('#playerModal'), video=document.querySelector('#video');
  document.querySelector('#playerTitle').textContent=item.title;
  document.querySelector('#playerDesc').textContent=item.description||'';
  document.querySelector('#playerSource').textContent='Source: '+(item.source||'User-provided stream');
  video.src=item.url; modal.classList.remove('hidden');
  video.play().catch(()=>toast('Press Play to start. Some streams may require a supported browser or network.'));
}
function closePlayer(){const v=document.querySelector('#video');v.pause();v.removeAttribute('src');v.load();document.querySelector('#playerModal').classList.add('hidden');}
function addStream(){
  const title=document.querySelector('#streamName').value.trim(),url=document.querySelector('#streamUrl').value.trim(),poster=document.querySelector('#streamPoster').value.trim();
  if(!title||!url){toast('Enter a channel name and official stream URL.');return;}
  try {const u=new URL(url);if(!['https:','http:'].includes(u.protocol))throw 0;}catch{toast('Please enter a valid http/https URL.');return;}
  userStreams.push({id:'user-'+Date.now(),title,category:'Live TV',kind:'live',description:'User-added stream. Confirm you have permission to use it.',poster,url,source:'User-added'});
  localStorage.setItem('ryhan-streams',JSON.stringify(userStreams));
  activeCategory='Live TV';render();toast('Channel added to this device.');
}
let toastTimer;
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
render();
if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('./sw.js').catch(()=>{});

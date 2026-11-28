/* WMM 메인 홈 한국어·영어 전환 (2026-11-28) — ?lang=en 이면 영어, 아니면 한국어 */
(function(){
var en=/[?&]lang=en\b/.test(location.search);
document.querySelectorAll('[data-lang-switch] a').forEach(function(a){a.setAttribute('aria-current',(a.getAttribute('data-l')==='en')===en?'true':'false')});
if(!en)return;
var D={
"월드메이킹멤버스":"Est. 2021 · Seoul","회사 소개":"About","정부지원사업":"Government support","해외 진출":"Market entry","멤버십":"Membership","상담 신청":"Contact us",
"찾고, 준비하고, 만들고, 나눕니다.":"Find, prepare, build and give back.",
"월드메이킹멤버스(WMM)의 모든 서비스를 한 장에 모았습니다. 지금 필요한 곳에서 시작하세요.":"Every World Making Members (WMM) service on one page. Start wherever you need to.",
"기회 찾기":"Find opportunities","정부지원사업 실행센터":"Government support centre","지역·대상별 검색, 공식 원문과 신청 준비표":"Search by region and applicant, with official notices and an application checklist",
"해외 정부 사업·입찰 · 상세는 회원가입 후":"Foreign government programmes and tenders · details after sign-up","WMM 회사 홈페이지":"WMM company site","회사와 그룹 서비스 소개":"The company and its group services",
"신청과 사업 준비":"Apply and prepare","신청 준비와 사업계획서":"Application and business plan","자격·마감·증빙 확인, PSST 초안":"Eligibility, deadlines and documents, plus a PSST draft",
"WMM 플레이그라운드":"WMM Playground","아이디어를 7일 동안 직접 실천":"Put an idea into practice for 7 days","미리보기":"Preview","AI 도구 비교와 업무 지시문":"AI tool comparisons and work prompts",
"제작·기업 지원":"Production and business support","뭉치고 제작 상품":"Mungchigo production","콘텐츠 상품·작업 예시·견적":"Content products, samples and quotes","제안서·PPT, 웹사이트, 업무자동화 프로젝트":"Proposals and decks, websites and workflow automation projects","비즈니스 스튜디오":"Business Studio",
"WMM 멤버십":"WMM Membership","M0 무료부터 M5 전략까지, 등급과 이용 범위":"From free M0 to strategic M5: grades and scope",
"공익과 운영":"Giving and operations","월드미라클메이커스":"World Miracles Makers","준비 중":"Coming soon","자폐 아동 피아노·힐링 지원 등 공익 프로그램 구상":"Planned public-benefit programmes, including piano and healing support for autistic children",
"GCSME 한국지사":"GCSME Korea Branch","영국 본사 공식 위임 · 해외 네트워크 연결":"Officially authorised by the UK headquarters · international network","73036396@naver.com · 범위와 비용을 먼저 안내":"73036396@naver.com · we confirm scope and cost first",
"법인 설립 · 서울":"Founded in Seoul","193개국":"193 countries","GOV RADAR가 살피는 나라":"Covered by GOV RADAR","영국 본사 공식 한국지사":"Official Korea branch of the UK HQ","한 팀":"One team","조사부터 실행까지 한 창구":"One contact from research to delivery",
"이덕영":"Duk Young Lee","대표 · GCSME 한국지사장":"CEO · Head of GCSME Korea","대표 인사말":"A message from our CEO",
"사업을 시작하는 분들이 가장 먼저 부딪히는 벽은 정보가 없어서가 아니라, 무엇부터 해야 할지 모른다는 것입니다.":"The first wall most founders hit is not a lack of information. It is not knowing where to begin.",
"안녕하십니까. 월드메이킹멤버스 대표 이덕영입니다.":"Hello. I am Duk Young Lee, CEO of World Making Members.",
"정부지원사업 공고는 해마다 수천 건이 나오고, 해외에는 그보다 훨씬 많은 정부 사업과 입찰이 열립니다. 그런데 좋은 기술과 성실한 마음을 가진 대표님들이 서류 한 장, 발표 10분, 믿을 만한 현지 파트너 한 곳이 없어 기회를 놓치는 모습을 많이 보았습니다.":"Thousands of government support calls are published in Korea every year, and far more government programmes and tenders open abroad. Yet I have seen many founders with good technology and honest intentions miss out for want of one document, a ten-minute pitch or one reliable local partner.",
"WMM은 그 빈자리를 채우려고 만든 회사입니다. 공고를 함께 찾고, 심사위원이 읽는 순서로 사업계획서를 쓰고, 발표를 준비하고, 선정된 다음 해와 해외 시장까지 이어지는 길을 함께 설계합니다. 영국 GCSME 본사의 한국지사로서 세계 각국의 네트워크와도 연결합니다.":"WMM was founded to fill that gap. We find the right calls together, write business plans in the order evaluators read them, prepare the pitch, and map out the path to the following year and to overseas markets. As the Korea branch of GCSME in the UK, we also connect you with networks around the world.",
"저희는 결과를 보장한다고 말하지 않습니다. 대신 확인된 사실로 판단하고, 맡은 일의 범위와 비용을 먼저 약속하며, 끝까지 곁에 있겠습니다. 한 기업의 성장이 이웃을 돕는 힘으로 이어지는 일, WMM이 가장 하고 싶은 일입니다.":"We do not promise results. Instead we work from verified facts, agree the scope and cost before we start, and stay with you to the end. Helping one company grow in a way that also helps its neighbours is what WMM most wants to do.",
"월드메이킹멤버스 주식회사 대표 · GCSME 한국지사장":"CEO, World Making Members Co., Ltd. · Head of GCSME Korea",
"일하는 원칙":"How we work","고객의 돈과 시간을 쓰는 일이라, 약속할 수 있는 것만 약속합니다.":"We spend our clients' money and time, so we only promise what we can deliver.",
"확인된 사실로 판단합니다":"We work from verified facts","핵심 사실은 서로 다른 출처 두 곳 이상에서 확인하고, 확인하지 못한 것은 그렇다고 적습니다.":"Key facts are confirmed by at least two independent sources, and anything unconfirmed is labelled as such.",
"범위와 비용을 먼저 정합니다":"Scope and cost come first","무엇을, 언제까지, 얼마에 하는지 착수 전에 문서로 합의합니다. 추가 비용은 미리 알려 드립니다.":"We agree in writing what we will do, by when and for how much before work starts. Any extra cost is flagged in advance.",
"AI는 빠르게, 판단은 사람이":"AI for speed, people for judgement","AI로 조사와 초안을 빠르게 만들고, 고객에게 가는 모든 결과물은 사람이 검수합니다.":"AI speeds up research and drafts; a person reviews everything before it reaches you.",
"보장하지 않는 것은 말하지 않습니다":"No promises we cannot keep","선정·수주·매출은 평가위원과 상대가 결정합니다. 저희는 그 가능성을 높이는 준비를 돕습니다.":"Selection, contracts and sales are decided by evaluators and counterparties. We help you prepare to improve your chances.",
"Mobin Rafiq · GCSME 설립자·회장":"Mobin Rafiq · Founder and Chairman, GCSME","한국지사 위임장 (2026.01.01)":"Korea branch authorisation (1 Jan 2026)",
"영국 GCSME 본사의 공식 한국지사":"Official Korea branch of GCSME UK",
"GCSME(Global & Commonwealth SME Club)는 영국 런던에 본사를 둔 중소기업 국제 네트워크입니다. 월드메이킹멤버스는 GCSME 영국 본사의 위임을 받아 한국지사를 설립·운영하며, 이덕영 대표가 한국지사장을 맡고 있습니다.":"GCSME (Global & Commonwealth SME Club) is an international SME network headquartered in London. Authorised by the UK headquarters, World Making Members established and runs the Korea branch, with CEO Duk Young Lee as its head.",
"한국 기업이 해외 정부·기관·기업과 만날 때 GCSME 네트워크와 공식레터 절차를 통해 연결을 돕습니다. 실제 과업은 국가별 권한 확인과 별도 계약 범위에 따라 진행합니다.":"We help Korean companies meet foreign governments, institutions and businesses through the GCSME network and its official letter process. Actual work proceeds after authority is confirmed for each country and under a separate contract.",
"GCSME 영국 본사 ↗":"GCSME UK headquarters ↗","GCSME 한국지사 ↗":"GCSME Korea branch ↗",
"걸어온 길":"Our story","작게 시작해 하나씩 쌓아 왔습니다.":"We started small and built step by step.",
"월드메이킹멤버스 주식회사 설립":"World Making Members Co., Ltd. founded","서울에서 경영컨설팅 법인으로 시작했습니다.":"Started in Seoul as a management consulting company.",
"통신판매업 신고":"Mail-order business registration","제2024-서울서초-2185호. 온라인으로 서비스와 자료를 제공하기 시작했습니다.":"No. 2024-Seoul Seocho-2185. We began offering services and materials online.",
"GCSME 영국 본사 한국지사 위임":"Authorised as GCSME's Korea branch","GCSME 한국지사를 설립·운영하는 공식 위임을 받았습니다.":"Officially authorised to establish and run the GCSME Korea branch.",
"GOV RADAR 공개":"GOV RADAR launched","193개국 정부 아젠다·입찰·위험 정보를 한곳에서 보는 레이더를 열었습니다.":"Opened a radar showing government agendas, tenders and risks for 193 countries in one place.",
"정부지원사업 서비스 시작":"Government support service launched","국내·해외 지원사업 검색부터 서류·발표·후속 사업까지 함께하는 서비스를 시작했습니다.":"Launched a service covering Korean and overseas support programmes, from search to documents, pitches and follow-on programmes.",
"회사 정보":"Company information","회사소개서 PDF":"Company profile (PDF)","상호":"Company","월드메이킹멤버스 주식회사 (WORLD MAKING MEMBERS)":"World Making Members Co., Ltd.","대표":"CEO","업종":"Business","서비스 · 경영컨설팅":"Services · management consulting","설립":"Founded","2021년 12월":"December 2021","통신판매업 신고":"Mail-order registration","제2024-서울서초-2185호":"No. 2024-Seoul Seocho-2185","협력":"Partner","GCSME(Global & Commonwealth SME Club) 한국지사":"GCSME (Global & Commonwealth SME Club) Korea branch","이메일":"Email",
"월드메이킹멤버스 주식회사":"World Making Members Co., Ltd.","WMM 홈":"WMM home","개인정보 안내":"Privacy","73036396@naver.com · 통신판매업신고 제2024-서울서초-2185호":"73036396@naver.com · Mail-order registration No. 2024-Seoul Seocho-2185"
};
document.documentElement.lang="en";
document.title="WMM World Making Members | Find, prepare, build and give back";
var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,list=[];
while(n=w.nextNode())list.push(n);
list.forEach(function(t){var k=t.nodeValue.replace(/\s+/g," ").trim();if(k&&D[k]){var lead=t.nodeValue.match(/^\s*/)[0],trail=t.nodeValue.match(/\s*$/)[0];t.nodeValue=lead+D[k]+trail}});
var ceo=document.querySelector('.ceo img');if(ceo)ceo.alt="Duk Young Lee, CEO of World Making Members";
document.querySelectorAll('a[href="/membership/"],a[href="/business-studio/"]').forEach(function(a){a.href=a.getAttribute('href')+(a.getAttribute('href')==="/business-studio/"?"en":"?lang=en")});
document.querySelectorAll('a[href="/home-details?lang=ko"]').forEach(function(a){a.href="/home-details?lang=en"});
})();

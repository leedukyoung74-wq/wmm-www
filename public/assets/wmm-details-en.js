/* 해외진출·정부지원사업 실행 페이지 한국어·영어 전환 (2026-11-28) */
(function(){
var en=/[?&]lang=en\b/.test(location.search);
document.querySelectorAll('[data-lang-switch] a').forEach(function(a){a.setAttribute('aria-current',(a.getAttribute('data-l')==='en')===en?'true':'false')});
if(!en)return;
var D={"해외진출·정부지원사업 실행":"Market entry & government support","해외진출 서비스":"Market-entry services","프로젝트 분야":"Project areas","진행 방식":"How we work","자료":"Resources","상담 신청":"Contact us",
"사업의 시작부터 실행까지,":"From the first step to delivery,","하나의 팀으로.":"as one team.",
"조사, 전략, 제안서, 디자인, 웹, 마케팅, 영업 운영을 하나의 실행계획으로 연결합니다. 프로젝트마다 담당자, 산출물, 일정과 비용을 먼저 합의하고 진행합니다.":"We bring research, strategy, proposals, design, web, marketing and sales operations into one delivery plan. For every project we agree the owner, deliverables, schedule and cost before we begin.",
"회사소개서 PDF":"Company profile (PDF)","진출 준비를 현지 기준으로. 서비스별 범위와 금액은 상담 후 협의합니다.":"Preparing for local standards. Scope and fees for each service are agreed after consultation.",
"해외진출 진단":"Market-entry assessment","1개 국가·제품군의 역량과 진출 장애요인을 검토합니다.":"We review your capabilities and the barriers to entry for one country and product group.","역량표 · 시장·채널 조사 · 진출 여부 의견":"Capability sheet · market and channel research · go/no-go opinion","상담 후 견적":"Quote after consultation",
"현지 맞춤 영문 기업서류":"English company documents for the target market","대상 기관·바이어 요구에 맞춰 기업서류를 구성하고 영문으로 만듭니다.":"We structure your company documents for the target institutions and buyers and produce them in English.","기업소개서 · 역량표 · 제품·기술자료 · 국가별 제안서":"Company profile · capability sheet · product and technical sheets · country proposals",
"6주 시장 검증":"6-week market validation","후보 조사, 접촉 기록, 현지 검토를 실행 판단 자료로 정리합니다.":"Candidate research, contact logs and local reviews turned into a decision pack.","후보 10곳 조사 · 적합 후보 5곳 검토 · 검증 보고":"10 candidates researched · 5 shortlisted · validation report",
"국가별 GCSME 공식레터":"GCSME official letters by country","목적·국가·수신기관을 정하고 GCSME 본부의 발신 권한과 서명 절차를 확인합니다.":"We define the purpose, country and recipient, and confirm GCSME headquarters' authority and signing process.","초안 → 본부 검토 → 서명·발송 → 회신 추적":"Draft → HQ review → signing and dispatch → reply tracking",
"공증·인증·전문 법률검토·번역 인증은 별도입니다. 공식레터는 정부 승인·수주·기관 회신을 보장하지 않습니다.":"Notarisation, certification, legal review and certified translation are separate. Official letters do not guarantee government approval, contracts or replies.",
"WMM이 통합 창구가 되어 과업·담당자·산출물·예산을 하나의 실행안으로 묶습니다.":"WMM acts as your single point of contact, combining tasks, owners, deliverables and budget into one plan.",
"해외진출·GCSME 연계":"Market entry with GCSME","대상국 진단부터 영문자료와 현지 검토까지":"From country assessment to English documents and local review","제조·환경·에너지":"Manufacturing, environment and energy","수처리·설비·환경기술을 현지 조건에 맞게 구체화":"Water treatment, equipment and environmental technology adapted to local conditions",
"건설·공간·복합개발":"Construction and mixed-use development","공간 프로그램과 운영수익 구조를 함께 검토":"Space programmes reviewed together with operating revenue","브랜드·해외유통":"Brands and overseas distribution","제품 공급과 현지 판매·운영 구조를 연결":"Connecting product supply with local sales and operations",
"문화·교육·사회공헌":"Culture, education and social impact","교육·공연·행사 프로그램을 운영 가능한 사업으로":"Education, performance and event programmes made operable","콘텐츠·온라인 운영":"Content and online operations","자료 제작부터 웹·마케팅·후속관리까지":"From materials to web, marketing and follow-up",
"실제 착수와 외부기관 연계는 역량·권한·자료 확인과 계약 후 진행합니다. 인허가·법률·세무 등 전문업무는 해당 자격을 갖춘 전문가의 별도 검토가 필요합니다.":"Work and third-party engagement start after capabilities, authority and materials are confirmed and a contract is signed. Licensing, legal and tax matters need separate review by qualified professionals.",
"한 창구에서 협의하고, 단계마다 결과물을 확인합니다.":"One point of contact, with results checked at every stage.","의뢰 정리·진단":"Brief and assessment","목표·대상국·자료·예산·일정 확인":"Goals, target country, materials, budget and timing","시장·사업성 검토":"Market and feasibility review","수요 근거, 원가, 위험 정리":"Demand evidence, costs and risks",
"제안자료·웹 제작":"Proposals and web","소개서·제안서·웹·콘텐츠":"Profiles, proposals, web and content","고객 발굴·계약":"Prospecting and contracts","상담·견적·계약 조건 관리":"Meetings, quotes and contract terms","납품·성과 관리":"Delivery and results","검수·입금 확인, 후속 제안":"Acceptance, payment and follow-on proposals",
"기간·금액·성과지표는 착수 전에 문서로 합의합니다. 수주·매출·투자유치는 보장하지 않습니다.":"Timeline, fees and KPIs are agreed in writing before work starts. We do not guarantee contracts, sales or investment.",
"WMM 멤버십":"WMM Membership","한 번의 계약에서 지속적인 협력으로. M0 무료부터 M5 전략까지, 등급마다 이용 범위가 다릅니다.":"From a single contract to an ongoing partnership. From free M0 to strategic M5, each grade has its own scope.","멤버십 보기":"View membership",
"GCSME 한국지사":"GCSME Korea Branch","영국 GCSME 본사의 위임을 받아 월드메이킹멤버스가 한국지사를 운영합니다. 해외 정부·기관·기업과의 연결을 돕습니다.":"Authorised by GCSME's UK headquarters, World Making Members runs the Korea branch and helps connect you with foreign governments, institutions and companies.","자세히 보기":"Learn more",
"상담 전에 미리 살펴보실 수 있습니다.":"Take a look before we talk.","사업운영 소개":"Business operations overview","신규 프로젝트 진행 절차":"New project process","콘텐츠 기획 자료 (한·영)":"Content planning pack (KO/EN)",
"우리 기업에 맞는 범위부터.":"Start with the right scope.","제품·서비스 자료, 목표 국가, 원하는 결과를 알려 주시면 진단 범위와 진행 조건을 안내합니다.":"Tell us about your products or services, target country and goals, and we will propose the assessment scope and terms.",
"기업명 / 프로젝트":"Company / project","대상 국가":"Target country","희망 서비스":"Service","영문 기업서류":"English company documents","GCSME 공식레터":"GCSME official letter","분야별 프로젝트":"Sector project","멤버십":"Membership",
"자료·원하는 결과·일정":"Materials, desired results and timing","이메일 앱에서 보내기":"Send from your email app","입력 내용은 저장되지 않습니다. 이메일 앱에서 직접 보내 주세요.":"Nothing you type is stored. Please send it from your email app.",
"월드메이킹멤버스 주식회사":"World Making Members Co., Ltd.","WMM 홈":"WMM home","정부지원사업":"Government support","개인정보 안내":"Privacy","73036396@naver.com · 통신판매업신고 제2024-서울서초-2185호":"73036396@naver.com · Mail-order registration No. 2024-Seoul Seocho-2185"};
document.documentElement.lang="en";document.title="Market entry & government support partner | WMM World Making Members";
var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n,l=[];while(n=w.nextNode())l.push(n);
l.forEach(function(t){var k=t.nodeValue.replace(/\s+/g," ").trim();if(k&&D[k])t.nodeValue=t.nodeValue.match(/^\s*/)[0]+D[k]+t.nodeValue.match(/\s*$/)[0]});
var tg=document.getElementById('target');if(tg)tg.placeholder="e.g. Vietnam, United Kingdom";
document.querySelectorAll('a[href="/membership/"]').forEach(function(a){a.href="/membership/?lang=en"});
document.querySelectorAll('a[href="/#gcsme"],a[href="/"]').forEach(function(a){a.href=a.getAttribute('href').replace('/','/?lang=en')});
})();

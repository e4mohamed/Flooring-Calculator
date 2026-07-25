/* =======================================================================
   company-info.js — يجلب اسم/شعار/عنوان الشركة من قاعدة البيانات ويطبّقها
   =======================================================================
   يُستخدم في كل الصفحات (index / products / quotation / admin-quotations)
   عبر: <script type="module" src="company-info.js"></script>

   لا يوقف عرض الصفحة أبدًا — إن تعذّر الوصول لقاعدة البيانات (لا يوجد
   إنترنت مثلاً) تبقى الشعار/الاسم/العنوان الافتراضية المدمجة في كل صفحة
   كما هي، بدون أي خطأ ظاهر للمستخدم.

   عناصر الصفحة التي يتم تحديثها تلقائيًا (بإضافة الـ class المناسب):
     - .company-logo          → أي <img> شعار (يُحدَّث src)
     - .company-address-text  → أي عنصر يحتوي اسم/عنوان الشركة كفقرات
     - link[rel=icon] / link[rel=apple-touch-icon] → أيقونة التبويب/آيفون
   ======================================================================= */

export async function loadAndApplyCompanyInfo(){
  try{
    const { db, COMPANY_INFO_DOC_PATH } = await import("./firebase-config.js");
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const snap = await getDoc(doc(db, ...COMPANY_INFO_DOC_PATH));
    if(!snap.exists()) return;
    const data = snap.data();

    if(data.logoDataUrl){
      document.querySelectorAll(".company-logo").forEach(img=>{ img.src = data.logoDataUrl; });

      const favicon = document.querySelector('link[rel="icon"]');
      if(favicon) favicon.href = data.logoDataUrl;
      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if(appleIcon) appleIcon.href = data.logoDataUrl;
    }

    if(data.name || data.addressLine1 || data.addressLine2){
      document.querySelectorAll(".company-address-text").forEach(el=>{
        el.innerHTML = "";
        if(data.name){
          const p = document.createElement("p");
          p.textContent = data.name;
          el.appendChild(p);
        }
        if(data.addressLine1){
          const p = document.createElement("p");
          p.textContent = data.addressLine1;
          el.appendChild(p);
        }
        if(data.addressLine2){
          const p = document.createElement("p");
          p.textContent = data.addressLine2;
          el.appendChild(p);
        }
      });
    }
  }catch(err){
    console.error("تعذر تحميل بيانات الشركة من قاعدة البيانات:", err);
  }
}

loadAndApplyCompanyInfo();

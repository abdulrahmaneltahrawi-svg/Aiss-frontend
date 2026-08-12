// بيانات الفعاليات (المؤتمرات والمسابقات)
const events = [
  {
    id: 9,
    title: "مسابقة السلامة العربية – الدورة الرابعة",
    image: "assets/events/photo/event (4).webp",
    category: "مسابقة",
    description: `
    <hr>
      <div class="intro-text">
        <p>مسابقة السلامة العربية، التي ينظمها المعهد العربي العلوم السلامة كل عام، تعد بمثابة أول مسابقة علمية عربية للمبتكرين والمخترعين في علوم السلامة، والتي تعد ضمن أهداف المعهد التي  يسعى لتحقيقها على مستوى الوطن  العربي، لنشر ثقافة السلامة المحلية والإقليمية وتجويد الأبحاث والابتكارات وتميزها.</p>
        <br>
        <p><strong>يحق لجميع المواطنين العرب- من الجنسين- المشاركة في المسابقة.</strong></p>
        <br>
        <p><strong>تم فتح باب الاشتراك في ٢٠ أبريل ٢٠٢٤</strong></p>
      </div>
      <div class="full-topic">
        <br>
        <p><strong>يُقدِّم المعهد العربي لعلوم السلامة جوائز قيمة للفائزين في المسابقة، عبارة عن</strong></p>
        <ul>
          <li> جوائز مالية قيمة.</li>
          <li> درع المعهد العربي لعلوم السلامة، بالإضافة إلى شهادة تقدير.</li>
          <li> فرصة للفوز بعضوية مجانية لمدة عام على منصة المعهد العربي لعلوم السلامة AISS.CO والاستفادة بالمزايا والخدمات المقدمة من المعهد.</li>
          <li> نشر أسماء الفائزين في (مجلة السلامة العربية) ، وعلى جميع منصَّات المعهد العربي لعلوم السلامة.</li>
        </ul>
        <br>
        <p><strong>مسارات المسابقة:</strong></p>
        <ul>
          <li> المسار الأول: بحث تقني/ علمي</li>
          <li>المسار الثاني: ابتكارات واختراعات</li>
        </ul>
<br>
        <p><strong>الفائزون في الدورة الرابعة من المسابقة :</strong></p>
        <li>الاستشاري رشيد كروح- المملكة المغربية- المركز الأول أبحاث</li>
          <li>الأستاذ مصطفي على بشري علام- جمهورية مصر العربية- المركز الأول ابتكارات</li>
      </div>
      
      <br>

      <div class="judges-section">
        <strong>أسماء المحكمين :</strong>
        <ul class="winners-list" style="list-style: none; padding-right: 0;">
            <li style="margin-bottom: 10px; font-size: 1.1rem;"><strong>1-</strong> د. تماضر محمد طه</li>
            <li style="margin-bottom: 10px; font-size: 1.1rem;"><strong>2-</strong> د. هدى حسن</li>
            <li style="margin-bottom: 10px; font-size: 1.1rem;"><strong>3-</strong> د. فاتن شيرة</li>
            <li style="margin-bottom: 10px; font-size: 1.1rem;"><strong>4-</strong> د. مصطفى الخضرى</li>
            <li style="margin-bottom: 10px; font-size: 1.1rem;"><strong>5-</strong> م. يعقوب أحمد بنى طه</li>
        </ul>
    </div>

      <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;">
    
    <!-- حاوية الأزرار -->
    <div style="display: flex; gap: 15px; margin-top: 40px; padding: 20px; background: #fcfcfc; border-radius: 15px; border: 1px solid #f0f0f0; justify-content: center; flex-wrap: wrap;">
        
        <a href="assets/events/paragraph/دليل مسابقة السلامة العربية الدورة الرابعة2024 .pdf" 
           target="_blank" 
           style="flex: 1; min-width: 220px; max-width: 280px; display: flex; align-items: center; padding: 10px 15px; background: linear-gradient(135deg, #235287, #1a3a5f); color: white; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 10px rgba(35, 82, 135, 0.2); border-bottom: 4px solid #102a46;">
            <div style="width: 45px; height: 45px; overflow: hidden; border-radius: 8px; margin-left: 12px; display: flex; align-items: center; justify-content: center;">
                <img src="assets/icons/press-button.png" alt="Agenda" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="display: flex; flex-direction: column; text-align: right;">
                <span style="font-size: 10px; opacity: 0.8;">تصفح الملف</span>
                <span style="font-size: 15px; font-weight: bold;">الدليل التشغيلي </span>
            </div>
        </a>
    </div>
    `
  },

  {
    id: 8,
    title: "مؤتمر السلامة العربي الخامس",
    image: "assets/events/photo/event (9).webp",
    category: "مؤتمرات",
    description: `
    <hr>
    <div style="direction: rtl; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <div style="text-align: center; padding: 25px; background: #fbfbfb; border-radius: 15px; margin-bottom: 30px; border-right: 5px solid #1a237e; border-left: 5px solid #1a237e; box-shadow: inset 0 0 10px rgba(0,0,0,0.02);">
        <h2 style="color: #1a237e; margin: 0; font-size: 22px;">المؤتمر الخامس: السلامة (استدامة، تحديات، تكنولوجيا)</h2>
        <p style="color: #555; margin-top: 8px; font-weight: bold;">عام انعقاد المؤتمر: 2024</p>
        <div style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #fff, #fef9e7); padding: 6px 20px; border-radius: 50px; margin-top: 10px; border: 1px solid #ffd54f; font-size: 14px; color: #7f6d02; box-shadow: 0 3px 6px rgba(0,0,0,0.05);">
          <span>إجمالي المشاهدات الأضخم: <strong>50,000</strong></span>
        </div>
      </div>
      <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; color: #1a237e;"> محاور الابتكار وسلامة المستقبل</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 25px;">
        <div style="background: white; border: 1px solid #e8eaf6; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border-bottom: 4px solid #43a047;">
          <div style="background: #43a047; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; margin-bottom: 15px; font-weight: bold;">اليوم الأول</div>
          <p style="line-height: 1.6; font-weight: 600; color: #1b5e20; margin: 0;">تأثير المناخ (CLIMATE CHANGE) على بيئة العاملين</p>
        </div>
        <div style="background: white; border: 1px solid #e8eaf6; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border-bottom: 4px solid #b71c1c;">
          <div style="background: #b71c1c; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; margin-bottom: 15px; font-weight: bold;">اليوم الثاني</div>
          <p style="line-height: 1.6; font-weight: 600; color: #7f0000; margin: 0;">إجراءات السلامة بأوقات النزاعات والحروب</p>
        </div>
        <div style="background: white; border: 1px solid #e8eaf6; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border-bottom: 4px solid #311b92;">
          <div style="background: #311b92; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; margin-bottom: 15px; font-weight: bold;">اليوم الثالث</div>
          <p style="line-height: 1.6; font-weight: 600; color: #1a237e; margin: 0;">ربط الذكاء الاصطناعي (AI) مع تطور السلامة</p>
        </div>
      </div>
      <div class="intro-text">
        <p>نظم المعهد العربي لعلوم السلامة، مؤتمر السلامة العربي الخامس، بحضور نخبة من كبار الخبراء في مجال علوم السلامة، في الفترة من ٢٦ وحتى ٢٨ سبتمبر  ٢٠٢٤، تحت شعار "السلامة (استدامة، تحديات، تكنولوجيا)"</p>
        <p>وللمرة الأولى، أقيمت افتتاحية المؤتمر وجاهيا بالمملكة الأردنية الهاشمية- العقبة، تحت رعاية معالي رئيس مجلس سلطة منطقة العقبة الاقتصادية الخاصة.</p>
      </div>
      <div class="full-topic">
        <strong>محاور المؤتمر:</strong>
        <ul>
          <li>تأثير المناخ (climate change) على بيئة العاملين</li>
          <li>اجراءات السلامة بأوقات النزاعات والحروب</li>
          <li>ربط الذكاء الاصطناعي (AI) مع تطور السلامة</li>
        </ul>
        <strong>للاطلاع على محاضرات المؤتمر، تابع قناة المعهد العربي لعلوم السلامة على اليوتيوب:</strong> 
        <li><a href="https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W">https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W</a></li>
      </div>
    </div>
    <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;">
    <div style="display: flex; gap: 15px; margin-top: 40px; padding: 20px; background: #fcfcfc; border-radius: 15px; border: 1px solid #f0f0f0; justify-content: center; flex-wrap: wrap;">
      <a href="assets/events/books/اجندة مؤتمر السلامة العربي الخامس 2024.pdf" target="_blank" 
         style="flex: 1; min-width: 220px; max-width: 280px; display: flex; align-items: center; padding: 10px 15px; background: linear-gradient(135deg, #235287, #1a3a5f); color: white; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 10px rgba(35, 82, 135, 0.2); border-bottom: 4px solid #102a46;">
        <div style="width: 45px; height: 45px; overflow: hidden; border-radius: 8px; margin-left: 12px; display: flex; align-items: center; justify-content: center;">
          <img src="assets/icons/press-button.png" alt="Agenda" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; flex-direction: column; text-align: right;">
          <span style="font-size: 10px; opacity: 0.8;">تصفح الملف</span>
          <span style="font-size: 15px; font-weight: bold;">أجندة المؤتمر</span>
        </div>
      </a>
      <a href="assets/events/books/كتيب مؤتمر السلامة العربي الخامس 2024.pdf" target="_blank" 
         style="flex: 1; min-width: 220px; max-width: 280px; display: flex; align-items: center; padding: 10px 15px; background: linear-gradient(135deg, #e4293a, #b01e2b); color: white; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 10px rgba(228, 41, 58, 0.2); border-bottom: 4px solid #8d1621;">
        <div style="width: 45px; height: 45px; overflow: hidden; border-radius: 8px; margin-left: 12px; display: flex; align-items: center; justify-content: center;">
          <img src="assets/icons/press-button.png" alt="Booklet" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; flex-direction: column; text-align: right;">
          <span style="font-size: 10px; opacity: 0.8;">تصفح الآن</span>
          <span style="font-size: 15px; font-weight: bold;">كتيب المؤتمر</span>
        </div>
      </a>
    </div>`
  },

  {
    id: 7,
    title: "مسابقة السلامة العربية – الدورة الثالثة",
    image: "assets/events/photo/event (3).webp",
    category: "مسابقة",
    description: `
    <hr>
    <div class="intro-text">
      <p>مسابقة السلامة العربية، التي ينظمها المعهد العربي العلوم السلامة كل عام، تعد بمثابة أول مسابقة علمية عربية للمبتكرين والمخترعين في علوم السلامة...</p>
      <p><strong>تم فتح باب الاشتراك في 2 مارس 2023</strong></p>
    </div>
    <div class="full-topic">
      <strong>يُقدِّم المعهد العربي لعلوم السلامة جوائز قيمة للفائزين في المسابقة، عبارة عن:</strong>
      <ul>
        <li>جوائز مالية قيمة.</li>
        <li>درع المعهد العربي لعلوم السلامة، بالإضافة إلى شهادة تقدير.</li>
        <li>فرصة للفوز بعضوية مجانية لمدة عام على منصة المعهد العربي لعلوم السلامة AISS.CO</li>
        <li>نشر أسماء الفائزين في (مجلة السلامة العربية) وعلى جميع منصات المعهد.</li>
      </ul>
      <strong>مسارات المسابقة:</strong>
      <ul>
        <li>المسار الأول: بحث تقني/ علمي</li>
        <li>المسار الثاني: ابتكارات واختراعات</li>
      </ul>
      <strong>الفائزون في الدورة الثالثة من المسابقة :</strong>
      <ul>
        <li>الأستاذ أحمد محمد مصطفى- جمهورية مصر العربية- الفائز بالمركز الأول أبحاث</li>
        <li>دكتور سيدي محمد مبروك- المملكة المغربية- الفائز بالمركز الأول ابتكارات</li>
        <li>المهندس مصطفى محمد البرلسي- جمهورية مصر العربية- الفائز بالمركز الثاني أبحاث</li>
        <li>المهندس معتز يحيى محمد- جمهورية مصر العربية- الفائز بالمركز الثاني ابتكارات</li>
      </ul>
    </div>
    <br>
    <div class="judges-section">
      <strong>أسماء المحكمين :</strong>
      <ul class="winners-list" style="list-style: none; padding-right: 0;">
        <li><strong>1-</strong> دتماضر محمد طه</li>
        <li><strong>2-</strong> د هدى حسن</li>
        <li><strong>3-</strong> م. مصطفى الخضرى</li>
        <li><strong>4-</strong> د فاتن شيره</li>
        <li><strong>5-</strong>د كرم عبد العاطى</li>
        <li><strong>6-</strong> د محمد الصغير</li>
      </ul>
    </div>
    <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;">
    <div style="display: flex; gap: 15px; margin-top: 40px; padding: 20px; background: #fcfcfc; border-radius: 15px; border: 1px solid #f0f0f0; justify-content: center; flex-wrap: wrap;">
      <a href="assets/events/paragraph/دليل مسابقة السلامة العربية الدورة الثالثة 2023.pdf" target="_blank" 
         style="flex: 1; min-width: 220px; max-width: 280px; display: flex; align-items: center; padding: 10px 15px; background: linear-gradient(135deg, #235287, #1a3a5f); color: white; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 10px rgba(35, 82, 135, 0.2); border-bottom: 4px solid #102a46;">
        <div style="width: 45px; height: 45px; overflow: hidden; border-radius: 8px; margin-left: 12px; display: flex; align-items: center; justify-content: center;">
          <img src="assets/icons/press-button.png" alt="Agenda" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; flex-direction: column; text-align: right;">
          <span style="font-size: 10px; opacity: 0.8;">تصفح الملف</span>
          <span style="font-size: 15px; font-weight: bold;">الدليل التشغيلي</span>
        </div>
      </a>
    </div>`
  },

  {
    id: 6,
    title: "مؤتمر السلامة العربي الرابع ",
    image: "assets/events/photo/event (8).webp",
    category: "مؤتمرات",
    description: `
    <div style="direction: rtl; color: #333;">
      <div style="text-align: center; padding: 25px; background: #f0f9ff; border-radius: 15px; margin-bottom: 30px; border-right: 5px solid #0288d1; border-left: 5px solid #0288d1;">
        <h2 style="color: #01579b; margin: 0; font-size: 22px;">المؤتمر الرابع: السلامة بوابة الاستدامة</h2>
        <p style="color: #555; margin-top: 8px; font-weight: bold;">عام انعقاد المؤتمر: 2023</p>
        <div style="display: inline-flex; align-items: center; background: #fff; padding: 5px 18px; border-radius: 50px; margin-top: 10px; border: 1px solid #b3e5fc; font-size: 13px; color: #0288d1;">
          <span>إجمالي المشاهدات: <strong>9.2k</strong></span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 25px;">
        <div style="background: white; border: 1px solid #e1f5fe; border-radius: 12px; padding: 20px; border-top: 4px solid #0288d1;">
          <div style="background: #0288d1; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; font-weight: bold;">اليوم الأول</div>
          <p style="font-weight: 600; color: #01579b;">تطبيقات هندسية في سلامة العمليات التصنيعية</p>
        </div>
        <div style="background: white; border: 1px solid #e1f5fe; border-radius: 12px; padding: 20px; border-top: 4px solid #388e3c;">
          <div style="background: #388e3c; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; font-weight: bold;">اليوم الثاني</div>
          <p style="font-weight: 600; color: #1b5e20;">الممارسات العملية الفضلى في إدارة السلامة</p>
        </div>
        <div style="background: white; border: 1px solid #e1f5fe; border-radius: 12px; padding: 20px; border-top: 4px solid #e4293a;">
          <div style="background: #e4293a; color: white; display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 12px; font-weight: bold;">اليوم الثالث</div>
          <p style="font-weight: 600; color: #8d1621;">القيادة والريادة في السلامة</p>
        </div>
      </div>
      <p>نظم المعهد العربي لعلوم السلامة مؤتمر السلامة العربي الرابع، مع نخبة من كبار الخبراء في مجال علوم السلامة، في الفترة ٢١ وحتى ٢٣ سبتمبر ٢٠٢٣، تحت شعار "السلامة بوابة الاستدامة".</p>
      <strong>للاطلاع على محاضرات المؤتمر، تابع قناة المعهد العربي لعلوم السلامة على اليوتيوب:</strong> 
      <li><a href="https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W">https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W</a></li>
    </div>`
  },

  {
    id: 5,
    title: "مؤتمر السلامة العربي الثالث ",
    image: "assets/events/photo/event (7).webp",
    category: "مؤتمرات",
    description: `
    <div style="direction: rtl; color: #333;">
      <div style="text-align: center; padding: 25px; background: #f4f9f4; border-radius: 15px; margin-bottom: 30px; border-right: 5px solid #1b5e20; border-left: 5px solid #1b5e20;">
        <h2 style="color: #1b5e20; font-size: 22px;">المؤتمر الثالث: السلامة العربية نحو 2030 واقع وتحديات</h2>
        <p style="font-weight: bold;">عام انعقاد المؤتمر: 2022</p>
      </div>
      <p>نظم المعهد العربي لعلوم السلامة، مؤتمر السلامة العربي الثالث (عن بُعد)، في الفترة من ٢٢ وحتى ٢٤ من سبتمبر ٢٠٢٢، تحت عنوان "السلامة العربية نحو ٢٠٣٠ واقع وتحديات".</p>
      <strong>محاور المؤتمر:</strong>
      <ul>
        <li>إدارة عمليات السلامة الحاضر والمأمول</li>
        <li>أكواد ومعايير السلامة وتحديات المستقبل في الوطن العربي</li>
        <li>آفاق السلامة العربية ورؤية ٢٠٣٠</li>
      </ul>
      <strong>للاطلاع على محاضرات المؤتمر:</strong>
      <li><a href="https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W">https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W</a></li>
    </div>`
  },

  {
    id: 4,
    title: "مسابقة السلامة العربية – الدورة الثانية",
    image: "assets/events/photo/event (2).webp",
    category: "مسابقة",
    description: `
    <hr>
    <div class="intro-text">
      <p>مسابقة السلامة العربية... يحق لجميع المواطنين العرب- من الجنسين- المشاركة في المسابقة.</p>
      <p><strong>تم فتح باب الاشتراك في ١٠ مارس ٢٠٢٢</strong></p>
    </div>
    <div class="full-topic">
      <strong>يُقدِّم المعهد العربي لعلوم السلامة جوائز قيمة للفائزين:</strong>
      <ul>
        <li>جوائز مالية قيمة</li>
        <li>درع المعهد العربي لعلوم السلامة، بالإضافة إلى شهادة تقدير</li>
        <li>فرصة للفوز بعضوية مجانية لمدة عام على منصة AISS.CO</li>
        <li>نشر أسماء الفائزين في مجلة السلامة العربية</li>
      </ul>
      <strong>الفائزون في الدورة الثانية:</strong>
      <ul>
        <li>دكتورة حليمة شافعي- الجزائر- المركز الأول أبحاث</li>
        <li>دكتور سامح المصري- مصر- المركز الأول ابتكارات</li>
        <li>الكيميائية رانيا جلال إبراهيم- مصر- المركز الثاني أبحاث</li>
        <li>الأستاذ عصام محمد رمضان- مصر- المركز الثاني ابتكارات</li>
        <li>المهندس أشرف جمال جبرين- فلسطين- المركز الثالث أبحاث</li>
        <li>الأستاذ لحبيشي عبد العزيز- المغرب- المركز الثالث ابتكارات</li>
      </ul>
    </div>`
  },

  {
    id: 3,
    title: "مسابقة السلامة العربية – الدورة الأولى",
    image: "assets/events/photo/event (1).webp",
    category: "مسابقة",
    description: `
    <div class="intro-text">
      <p>مسابقة السلامة العربية، أول مسابقة علمية عربية للمبتكرين والمخترعين في علوم السلامة.</p>
    </div>
    <div class="full-topic">
      <strong>الفائزون في الدورة الأولى:</strong>
      <ul>
        <li>كريم محمد حافظ- مصر- المركز الأول أبحاث</li>
        <li>الدكتورة هبة الرحمن- مصر- المركز الأول ابتكارات</li>
        <li>الأستاذ مالك سلهب- فلسطين- المركز الثاني أبحاث</li>
        <li>الأستاذة ابتسام رويبح- المركز الثاني ابتكارات</li>
        <li>المهندس هامل هيثم- الجزائر- المركز الثالث ابتكارات</li>
      </ul>
    </div>`
  },

  {
    id: 2,
    title: "مؤتمر السلامة العربي الثاني ",
    image: "assets/events/photo/event (6).webp",
    category: "مؤتمرات",
    description: `
    <div style="direction: rtl; color: #333;">
      <div style="text-align: center; padding: 25px; background: #f0f4f8; border-radius: 15px; margin-bottom: 30px; border-right: 5px solid #1a3a5f; border-left: 5px solid #1a3a5f;">
        <h2 style="color: #1a3a5f; font-size: 22px;">المؤتمر الثاني: السلامة العربية نحو مجتمع آمن</h2>
        <p style="font-weight: bold;">عام انعقاد المؤتمر: 2021</p>
      </div>
      <p>نظم المعهد العربي لعلوم السلامة مؤتمر السلامة العربي الثاني، في الفترة من ٢٣ وحتى ٢٥ سبتمبر ٢٠٢١، تحت شعار "السلامة العربية نحو مجتمع عربي آمن"</p>
      <strong>محاور المؤتمر:</strong>
      <ul>
        <li>التقنيات والتوجهات الحديثة في علوم السلامة</li>
        <li>التغيرات المناخية وأثرها على سلامة المنشآت والبيئة</li>
        <li>تحديات تطبيق الأكواد وأنظمة السلامة على المباني</li>
      </ul>
      <strong>للاطلاع على محاضرات المؤتمر:</strong>
      <li><a href="https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W">https://youtube.com/@aiss-6016?si=OcTWx6d9Unfys-2W</a></li>
    </div>`
  },

  {
    id: 1,
    title: "مؤتمر السلامة العربي الأول",
    image: "assets/events/photo/event (5).webp",
    category: "مؤتمرات",
    description: `
    <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 15px; margin-bottom: 30px; border-right: 5px solid #235287; border-left: 5px solid #235287;">
      <h2 style="color: #235287; font-size: 24px;">المؤتمر الأول: السلامة وتحديات العصر</h2>
      <p style="color: #666;">عام انعقاد المؤتمر: 2020</p>
    </div>
    <p>نظم المعهد العربي لعلوم السلامة مؤتمر السلامة العربي الأول، في سبتمبر ٢٠٢٠، تحت شعار "السلامة وتحديات العصر"، والذي يعد الحدث الأول للسلامة على مستوى الشرق الأوسط وشمال أفريقيا.</p>
    <strong>ويهدف المؤتمر إلى:</strong>
    <ul>
      <li>توفير منتدى لتبادل المعرفة والممارسات والخبرات</li>
      <li>تعزيز وبناء الشبكات والتحالفات</li>
      <li>توفير منصة لتطوير المعرفة والأفكار الاستراتيجية</li>
    </ul>
    <strong>للاطلاع على محاضرات المؤتمر:</strong>
    <li><a href="https://youtube.com/@fsic-kq9sp?si=RcpSR0iGw1_SVhTB">https://youtube.com/@fsic-kq9sp</a></li>`
  }
];

export default events;
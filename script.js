"use strict";

/*
  إعدادات الحفلة
*/

const celebration = {
  name: "Sadeel Ghandi",
  date: "2026-10-10",
  time: "17:30",
  timeLabel: "5:30 PM",
  utcOffset: "+03:00",
  location: "نادي ضباط ضاحية الرشيد، عمّان",
  locationUrl: "https://maps.app.goo.gl/1Jjw5zwYZGXnxpUF8"
};


/* =========================
   العناصر الرئيسية
========================= */

const welcome = document.getElementById("welcome");
const invitation = document.getElementById("invitation");
const statusMessage = document.getElementById("status");

const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");


/* =========================
   عرض وقت الحفل
========================= */

document.getElementById("eventTime").textContent =
  celebration.timeLabel;


/* =========================
   الموسيقى
========================= */

// مستوى صوت مبدئي
backgroundMusic.volume = 0.3;

let musicRequested = false;


function updateMusicButton() {

  const isPlaying = !backgroundMusic.paused;

  musicToggle.textContent = isPlaying
    ? "Ⅱ إيقاف الموسيقى"
    : "♫ تشغيل الموسيقى";

  musicToggle.setAttribute(
    "aria-label",
    isPlaying
      ? "إيقاف الموسيقى"
      : "تشغيل الموسيقى"
  );

  musicToggle.setAttribute(
    "aria-pressed",
    String(isPlaying)
  );
}


async function playInvitationMusic() {

  musicRequested = true;
  musicStatus.textContent = "";

  try {

    await backgroundMusic.play();

    updateMusicButton();

  } catch (error) {

    updateMusicButton();

    if (error.name === "AbortError") {
      return;
    }

    if (error.name === "NotAllowedError") {

      musicStatus.textContent =
        "اضغطي زر تشغيل الموسيقى لبدء الأغنية.";

    } else {

      musicStatus.textContent =
        "تعذّر تشغيل الأغنية. تأكدي أن ملف MP3 موجود باسم music.mp3 داخل مجلد audio.";

    }
  }
}


/* زر تشغيل / إيقاف الموسيقى */

musicToggle.addEventListener("click", () => {

  if (backgroundMusic.paused) {

    playInvitationMusic();

  } else {

    backgroundMusic.pause();

  }

});


backgroundMusic.addEventListener("play", () => {

  musicStatus.textContent = "";

  updateMusicButton();

});


backgroundMusic.addEventListener(
  "pause",
  updateMusicButton
);


backgroundMusic.addEventListener("error", () => {

  if (musicRequested) {

    musicStatus.textContent =
      "تعذّر تحميل الأغنية. تحققي من اسم الملف ومساره وصيغته.";

  }

  updateMusicButton();

});


/* =========================
   فتح الدعوة
========================= */

document
  .getElementById("openInvitation")
  .addEventListener("click", () => {

    welcome.hidden = true;

    invitation.hidden = false;

    musicToggle.hidden = false;


    // تشغيل الموسيقى عند فتح الدعوة
    playInvitationMusic();


    window.scrollTo({
      top: 0,
      behavior: "instant"
    });


    document
      .getElementById("graduateName")
      .focus({
        preventScroll: true
      });


    launchConfetti();

  });


/* =========================
   التايمر
========================= */

/*
  موعد الحفل:
  October 10, 2026
  5:30 PM
  Jordan Time (+03:00)
*/

const targetTime = new Date(
  `${celebration.date}T${celebration.time}:00${celebration.utcOffset}`
).getTime();


/*
  نهاية يوم الحفل
*/

const dayStart = new Date(
  `${celebration.date}T00:00:00${celebration.utcOffset}`
).getTime();

const dayEnd =
  dayStart + 24 * 60 * 60 * 1000;


const timer =
  document.getElementById("timer");

const timerTitle =
  document.getElementById("countdownTitle");

const timerNote =
  document.getElementById("timerNote");


const timerElements = {

  days:
    document.getElementById("days"),

  hours:
    document.getElementById("hours"),

  minutes:
    document.getElementById("minutes"),

  seconds:
    document.getElementById("seconds")

};


timer.setAttribute(
  "aria-label",
  "الوقت المتبقي لموعد الحفل"
);


/*
  تحديث رقم داخل التايمر
*/

function setTimerValue(element, value) {

  const formatted =
    String(value).padStart(2, "0");

  if (element.textContent !== formatted) {

    element.textContent = formatted;

  }

}


/*
  تحديث العد التنازلي
*/

function updateCountdown() {

  const now = Date.now();

  const difference =
    Math.max(0, targetTime - now);

  const totalSeconds =
    Math.floor(difference / 1000);


  const days =
    Math.floor(totalSeconds / 86400);

  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;


  setTimerValue(
    timerElements.days,
    days
  );

  setTimerValue(
    timerElements.hours,
    hours
  );

  setTimerValue(
    timerElements.minutes,
    minutes
  );

  setTimerValue(
    timerElements.seconds,
    seconds
  );


  /*
    بعد انتهاء يوم الحفل
  */

  if (now >= dayEnd) {

    timerTitle.textContent =
      "ذكرى جميلة تبقى";

    timerNote.textContent =
      "شكرًا لكلّ من شاركنا فرحة التخرّج 🤍";

    return;

  }


  /*
    عندما تصل الساعة 5:30
  */

  if (now >= targetTime) {

    timerTitle.textContent =
      "حان موعد فرحتنا";

    timerNote.textContent =
      "أهلًا بكم بكلّ الحب 🤍";

    return;

  }


  /*
    قبل الحفل
  */

  timerTitle.textContent =
    "كلّ لحظة تقرّبنا من الفرحة";

  timerNote.textContent =
    "العدّ التنازلي حتى موعد الحفل — 10 أكتوبر 2026، الساعة 5:30 مساءً 🤍";

}


updateCountdown();


setInterval(
  updateCountdown,
  1000
);


document.addEventListener(
  "visibilitychange",
  () => {

    if (!document.hidden) {

      updateCountdown();

    }

  }
);


/* =========================
   قصاصات الاحتفال
========================= */

function launchConfetti() {

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {
    return;
  }


  const container =
    document.getElementById("confetti");


  const colors = [

    "#d7b980",

    "#e9bccb",

    "#f1d9e1",

    "#c8aa71"

  ];


  for (let i = 0; i < 45; i++) {

    const piece =
      document.createElement("span");


    piece.className =
      "confetti-piece";


    piece.style.left =
      `${Math.random() * 100}%`;


    piece.style.backgroundColor =
      colors[i % colors.length];


    piece.style.animationDelay =
      `${Math.random() * 1.3}s`;


    piece.style.borderRadius =
      i % 3 === 0
        ? "50%"
        : "1px";


    container.appendChild(piece);

  }


  setTimeout(() => {

    container.replaceChildren();

  }, 5000);

}


/* =========================
   تجهيز التقويم
========================= */

function escapeCalendarText(value) {

  return value

    .replace(/\\/g, "\\\\")

    .replace(/\n/g, "\\n")

    .replace(/;/g, "\\;")

    .replace(/,/g, "\\,");

}


function foldCalendarLine(line) {

  const encoder =
    new TextEncoder();

  let result = "";

  let byteCount = 0;


  for (const character of line) {

    const characterBytes =
      encoder.encode(character).length;


    if (
      byteCount + characterBytes > 75
    ) {

      result += "\r\n ";

      byteCount = 1;

    }


    result += character;

    byteCount += characterBytes;

  }


  return result;

}


function formatUtcDate(date) {

  return date

    .toISOString()

    .replace(/[-:]/g, "")

    .replace(/\.\d{3}/, "");

}


/* =========================
   حفظ موعد الحفل
========================= */

document
  .getElementById("saveDate")
  .addEventListener("click", () => {


    const timestamp =
      formatUtcDate(new Date());


    /*
      بداية الحفل 5:30 PM
    */

    const startDate =
      new Date(targetTime);


    /*
      مدة الحفل الافتراضية:
      3 ساعات
    */

    const endDate =
      new Date(
        targetTime +
        3 * 60 * 60 * 1000
      );


    const description =

      "بدعوة من والدة الخريجة لمشاركتها فرحة تخرّج ابنتها. " +

      "Artificial Intelligence — American University of Madaba. " +

      "وقت الحفل: 5:30 PM. " +

      "الموقع: " +

      celebration.locationUrl;


    const lines = [

      "BEGIN:VCALENDAR",

      "VERSION:2.0",

      "PRODID:-//Sadeel//Graduation Invitation//AR",

      "CALSCALE:GREGORIAN",

      "BEGIN:VEVENT",

      "UID:sadeel-graduation-20261010@invitation.local",

      `DTSTAMP:${timestamp}`,

      `DTSTART:${formatUtcDate(startDate)}`,

      `DTEND:${formatUtcDate(endDate)}`,

      `SUMMARY:${escapeCalendarText(
        "حفل تخرّج " + celebration.name
      )}`,

      `LOCATION:${escapeCalendarText(
        celebration.location
      )}`,

      `DESCRIPTION:${escapeCalendarText(
        description
      )}`,

      "TRANSP:TRANSPARENT",

      "END:VEVENT",

      "END:VCALENDAR"

    ];


    const calendarText =

      lines
        .map(foldCalendarLine)
        .join("\r\n") +

      "\r\n";


    const file =
      new Blob(
        [calendarText],
        {
          type:
            "text/calendar;charset=utf-8"
        }
      );


    const url =
      URL.createObjectURL(file);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "Sadeel-Graduation.ics";


    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(() => {

      URL.revokeObjectURL(url);

    }, 1000);


    statusMessage.textContent =
      "تم تنزيل موعد الحفل — 10 أكتوبر 2026 الساعة 5:30 مساءً 🤍";

  });


/* =========================
   التحقق من التشغيل المحلي
========================= */

function isLocalPage() {

  const hostname =
    location.hostname;


  return (

    !/^https?:$/.test(
      location.protocol
    ) ||

    [
      "localhost",
      "127.0.0.1",
      "[::1]",
      "0.0.0.0"
    ].includes(hostname) ||

    hostname.endsWith(".local") ||

    /^10\./.test(hostname) ||

    /^192\.168\./.test(hostname) ||

    /^172\.(1[6-9]|2\d|3[01])\./.test(
      hostname
    )

  );

}


/* =========================
   مشاركة الدعوة
========================= */

document
  .getElementById("shareInvitation")
  .addEventListener(
    "click",
    async () => {


      const text =

        "بكلّ حبّ وفخر، أدعوكم لمشاركتي فرحة تخرّج ابنتي 🎓\n\n" +

        "Sadeel Ghandi\n" +

        "Artificial Intelligence\n" +

        "American University of Madaba\n\n" +

        "October 10, 2026\n" +

        "5:30 PM\n\n" +

        `${celebration.location}\n` +

        `📍 ${celebration.locationUrl}\n\n` +

        "بحضوركم تكتمل فرحتي وفرحة ابنتي 🤍\n" +

        "والدة الخريجة";


      const canSharePageUrl =
        !isLocalPage();


      const shareData = {

        title:
          "Sadeel Ghandi | Graduation Invitation",

        text

      };


      if (canSharePageUrl) {

        shareData.url =
          location.href.split("#")[0];

      }


      try {


        if (navigator.share) {


          await navigator.share(
            shareData
          );


        } else if (

          navigator.clipboard &&

          window.isSecureContext

        ) {


          await navigator.clipboard.writeText(

            text +

            (
              canSharePageUrl
                ? "\n" + shareData.url
                : ""
            )

          );


          statusMessage.textContent =
            canSharePageUrl

              ? "تم نسخ الدعوة والرابط 🤍"

              : "تم نسخ نص الدعوة. مشاركة الرابط تتاح بعد نشر الموقع.";


        } else {


          statusMessage.textContent =
            "مشاركة رابط الدعوة تتاح بعد رفع الموقع على الاستضافة.";


        }


      } catch (error) {


        if (
          error.name !== "AbortError"
        ) {


          statusMessage.textContent =
            "تعذّرت المشاركة؛ يمكنك نسخ رابط الصفحة بعد نشرها.";


        }

      }

    }
  );
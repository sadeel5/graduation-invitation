"use strict";

/*
  إعدادات الحفلة

  اتركي time بقيمة null إلى أن تتحدد الساعة.

  مثال عند تحديد الساعة السادسة مساءً:
  time: "18:00",
  timeLabel: "الساعة السادسة مساءً",
*/

const celebration = {
  name: "Sadeel Ghandi",
  date: "2026-10-10",
  time: null,
  timeLabel: "يُحدَّد لاحقًا",
  utcOffset: "+03:00",
  location: "نادي ضباط ضاحية الرشيد، عمّان"
};

const welcome = document.getElementById("welcome");
const invitation = document.getElementById("invitation");
const statusMessage = document.getElementById("status");

const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");

document.getElementById("eventTime").textContent =
  celebration.timeLabel;

// مستوى صوت مبدئي؛ بعض الهواتف تتحكم بالصوت من أزرار الجهاز.
backgroundMusic.volume = 0.3;

// الموسيقى
let musicRequested = false;

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;

  musicToggle.textContent = isPlaying
    ? "Ⅱ إيقاف الموسيقى"
    : "♫ تشغيل الموسيقى";

  musicToggle.setAttribute(
    "aria-label",
    isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"
  );

  musicToggle.setAttribute("aria-pressed", String(isPlaying));
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

backgroundMusic.addEventListener("pause", updateMusicButton);

backgroundMusic.addEventListener("error", () => {
  if (musicRequested) {
    musicStatus.textContent =
      "تعذّر تحميل الأغنية. تحققي من اسم الملف ومساره وصيغته.";
  }

  updateMusicButton();
});

// فتح الدعوة وتشغيل الأغنية بنفس الكبسة
document
  .getElementById("openInvitation")
  .addEventListener("click", () => {
    welcome.hidden = true;
    invitation.hidden = false;
    musicToggle.hidden = false;

    // يبدأ التشغيل مباشرة من تفاعل الزائر.
    playInvitationMusic();

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    document.getElementById("graduateName").focus({
      preventScroll: true
    });

    launchConfetti();
  });

// التايمر
const targetTime = new Date(
  `${celebration.date}T${celebration.time || "00:00"}:00${celebration.utcOffset}`
).getTime();

const dayStart = new Date(
  `${celebration.date}T00:00:00${celebration.utcOffset}`
).getTime();

const dayEnd = dayStart + 24 * 60 * 60 * 1000;

const timer = document.getElementById("timer");
const timerTitle = document.getElementById("countdownTitle");
const timerNote = document.getElementById("timerNote");

const timerElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

timer.setAttribute(
  "aria-label",
  celebration.time
    ? "الوقت المتبقي لموعد الحفل"
    : "الوقت المتبقي لبداية يوم الحفل"
);

function setTimerValue(element, value) {
  const formatted = String(value).padStart(2, "0");

  if (element.textContent !== formatted) {
    element.textContent = formatted;
  }
}

function updateCountdown() {
  const now = Date.now();
  const difference = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setTimerValue(timerElements.days, days);
  setTimerValue(timerElements.hours, hours);
  setTimerValue(timerElements.minutes, minutes);
  setTimerValue(timerElements.seconds, seconds);

  if (now >= dayEnd) {
    timerTitle.textContent = "ذكرى جميلة تبقى";
    timerNote.textContent =
      "شكرًا لكلّ من شاركنا فرحة التخرّج 🤍";
    return;
  }

  if (now >= targetTime) {
    timerTitle.textContent = celebration.time
      ? "حان موعد فرحتنا"
      : "اليوم يوم فرحتنا";

    timerNote.textContent = celebration.time
      ? "أهلًا بكم بكلّ الحب 🤍"
      : "وصل يوم الحفل! ساعة الحفل تُحدَّد لاحقًا.";

    return;
  }

  timerTitle.textContent = "كلّ لحظة تقرّبنا من الفرحة";

  timerNote.textContent = celebration.time
    ? "العدّ التنازلي لموعد الحفل بتوقيت الأردن."
    : "العدّ التنازلي لبداية يوم الحفل بتوقيت الأردن؛ ساعة الحفل تُحدَّد لاحقًا.";
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCountdown();
  }
});

// قصاصات وردية وذهبية
function launchConfetti() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const container = document.getElementById("confetti");

  const colors = [
    "#d7b980",
    "#e9bccb",
    "#f1d9e1",
    "#c8aa71"
  ];

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 1.3}s`;
    piece.style.borderRadius = i % 3 === 0 ? "50%" : "1px";

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.replaceChildren();
  }, 5000);
}

// تجهيز نص التقويم
function escapeCalendarText(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function foldCalendarLine(line) {
  const encoder = new TextEncoder();
  let result = "";
  let byteCount = 0;

  for (const character of line) {
    const characterBytes = encoder.encode(character).length;

    if (byteCount + characterBytes > 75) {
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

// حفظ الحفل في التقويم
document.getElementById("saveDate").addEventListener("click", () => {
  const timestamp = formatUtcDate(new Date());
  let dateLines;

  if (celebration.time) {
    dateLines = [
      `DTSTART:${formatUtcDate(new Date(targetTime))}`
    ];
  } else {
    const [year, month, day] = celebration.date
      .split("-")
      .map(Number);

    const nextDay = new Date(Date.UTC(year, month - 1, day + 1))
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");

    dateLines = [
      `DTSTART;VALUE=DATE:${celebration.date.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${nextDay}`
    ];
  }

  const description =
    "بدعوة من والدة الخريجة لمشاركتها فرحة تخرّج ابنتها. " +
    "Artificial Intelligence — American University of Madaba. " +
    "وقت الحفل: " + celebration.timeLabel;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sadeel//Graduation Invitation//AR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:sadeel-graduation-20261010@invitation.local",
    `DTSTAMP:${timestamp}`,
    ...dateLines,
    `SUMMARY:${escapeCalendarText(
      "حفل تخرّج " + celebration.name
    )}`,
    `LOCATION:${escapeCalendarText(celebration.location)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  const calendarText =
    lines.map(foldCalendarLine).join("\r\n") + "\r\n";

  const file = new Blob([calendarText], {
    type: "text/calendar;charset=utf-8"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Sadeel-Graduation.ics";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  statusMessage.textContent = celebration.time
    ? "تم تنزيل موعد الحفل؛ افتحي الملف لإضافته إلى التقويم."
    : "تم تنزيل تذكير ليوم الحفل؛ افتحي الملف لإضافته إلى التقويم. الساعة تُحدَّد لاحقًا.";
});

// التحقق من التشغيل المحلي
function isLocalPage() {
  const hostname = location.hostname;

  return (
    !/^https?:$/.test(location.protocol) ||
    ["localhost", "127.0.0.1", "[::1]", "0.0.0.0"].includes(hostname) ||
    hostname.endsWith(".local") ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

// مشاركة الدعوة
document
  .getElementById("shareInvitation")
  .addEventListener("click", async () => {
    const text =
      "بكلّ حبّ وفخر، أدعوكم لمشاركتي فرحة تخرّج ابنتي 🎓\n\n" +
      "Sadeel Ghandi\n" +
      "Artificial Intelligence\n" +
      "American University of Madaba\n\n" +
      "October 10, 2026\n" +
      `${celebration.location}\n` +
      `وقت الحفل: ${celebration.timeLabel}\n\n` +
      "بحضوركم تكتمل فرحتي وفرحة ابنتي 🤍\n" +
      "والدة الخريجة";

    const canSharePageUrl = !isLocalPage();

    const shareData = {
      title: "Sadeel Ghandi | Graduation Invitation",
      text
    };

    if (canSharePageUrl) {
      shareData.url = location.href.split("#")[0];
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          text + (canSharePageUrl ? "\n" + shareData.url : "")
        );

        statusMessage.textContent = canSharePageUrl
          ? "تم نسخ الدعوة والرابط 🤍"
          : "تم نسخ نص الدعوة. مشاركة الرابط تتاح بعد نشر الموقع.";
      } else {
        statusMessage.textContent =
          "مشاركة رابط الدعوة تتاح بعد رفع الموقع على الاستضافة.";
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        statusMessage.textContent =
          "تعذّرت المشاركة؛ يمكنك نسخ رابط الصفحة بعد نشرها.";
      }
    }
  });
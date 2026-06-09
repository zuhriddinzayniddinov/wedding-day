import '../css/styles.css';

const audio = document.getElementById('audio');
const muteBtn =  document.getElementById("mute");

const day = document.getElementById("day");
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");
const sendBtn = document.getElementById("send");
const guest = document.querySelector("input[name=guest]");
const attendances = document.querySelectorAll("input[name=attendance]");
const previousDate = new Date('2026-07-08T00:00:00');
const guestValid = document.getElementById("guest-valid");

const attendanceValid = document.getElementById("attendance-valid");

const mute = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="#00000030" height="30" width="30" xmlns="http://www.w3.org/2000/svg" style="color: rgba(0, 0, 0, 0.19);"><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 432L64 80"></path><path d="M243.33 98.86a23.89 23.89 0 00-25.55 1.82l-.66.51-28.52 23.35a8 8 0 00-.59 11.85l54.33 54.33a8 8 0 0013.66-5.66v-64.49a24.51 24.51 0 00-12.67-21.71zm8 236.43L96.69 180.69A16 16 0 0085.38 176H56a24 24 0 00-24 24v112a24 24 0 0024 24h69.76l92 75.31a23.9 23.9 0 0025.87 1.69A24.51 24.51 0 00256 391.45v-44.86a16 16 0 00-4.67-11.3zM352 256c0-24.56-5.81-47.87-17.75-71.27a16 16 0 10-28.5 14.55C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 002.32 6.25l14.36 14.36a8 8 0 0013.55-4.31A146 146 0 00352 256zm64 0c0-51.18-13.08-83.89-34.18-120.06a16 16 0 00-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 001.9 8.26L389 337.4a8 8 0 0013.13-2.79C411 311.76 416 287.26 416 256z"></path><path d="M480 256c0-74.25-20.19-121.11-50.51-168.61a16 16 0 10-27 17.22C429.82 147.38 448 189.5 448 256c0 46.19-8.43 80.27-22.43 110.53a8 8 0 001.59 9l11.92 11.92a8 8 0 0012.92-2.16C471.6 344.9 480 305 480 256z"></path></svg>
`;

const unmute = `
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" color="#00000030" height="30" width="30" xmlns="http://www.w3.org/2000/svg" style="color: rgba(0, 0, 0, 0.19);"><path d="M232 416a23.88 23.88 0 01-14.2-4.68 8.27 8.27 0 01-.66-.51L125.76 336H56a24 24 0 01-24-24V200a24 24 0 0124-24h69.75l91.37-74.81a8.27 8.27 0 01.66-.51A24 24 0 01256 120v272a24 24 0 01-24 24zm-106.18-80zm-.27-159.86zM320 336a16 16 0 01-14.29-23.19c9.49-18.87 14.3-38 14.3-56.81 0-19.38-4.66-37.94-14.25-56.73a16 16 0 0128.5-14.54C346.19 208.12 352 231.44 352 256c0 23.86-6 47.81-17.7 71.19A16 16 0 01320 336z"></path><path d="M368 384a16 16 0 01-13.86-24C373.05 327.09 384 299.51 384 256c0-44.17-10.93-71.56-29.82-103.94a16 16 0 0127.64-16.12C402.92 172.11 416 204.81 416 256c0 50.43-13.06 83.29-34.13 120a16 16 0 01-13.87 8z"></path><path d="M416 432a16 16 0 01-13.39-24.74C429.85 365.47 448 323.76 448 256c0-66.5-18.18-108.62-45.49-151.39a16 16 0 1127-17.22C459.81 134.89 480 181.74 480 256c0 64.75-14.66 113.63-50.6 168.74A16 16 0 01416 432z"></path></svg>
`;
function toggleMute() {
    if (!audio.played) {
        audio.play();
    }
    if (audio.muted) {
        muteBtn.innerHTML = unmute;
        audio.muted = false
    } else {
        muteBtn.innerHTML = mute;
        audio.muted = true
    }
}
const timeCallback = () => {
    const currentDate = new Date();
    const differenceInMilliseconds = previousDate-currentDate;

    const totalSeconds = Math.floor(differenceInMilliseconds / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    day.innerText = days.toString();
    hour.innerText = hours < 10 ? "0" + hours.toString() : hours.toString();
    minute.innerText = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    second.innerText = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
};

const animations = Array.from(document.querySelectorAll('*')).filter(element =>
    window.getComputedStyle(element).transform !== 'none' && !element.classList.contains('-translate-y-1/2') && !element.classList.contains('-translate-x-1/2'));
const animationMinus = [];
let lastScrollTop = 0;

function handleScroll() {
    const scrollTop = window.scrollY;
    const scrollPosition = scrollTop + window.innerHeight;
    for (let i = 0; i < animations.length; i++) {
        const computedStyle = window.getComputedStyle(animations[i]);
        const transformValue = computedStyle.transform;
        const matrixValues = transformValue.match(/matrix.*\((.+)\)/)[1].split(', ');
        const translateX = parseFloat(matrixValues[4]);
        const translateY = parseFloat(matrixValues[5] ?? 0);
        const distanceToView = scrollPosition - (animations[i].getBoundingClientRect().top + window.scrollY);
        if (distanceToView > 0 && distanceToView < window.innerHeight) {
            const opacity = Math.min(1, distanceToView / window.innerHeight);
            const translate = translateX < 0 ? Math.min(0, translateX + distanceToView) : Math.max(0, translateX - distanceToView);

            animations[i].style.opacity = opacity;
            animations[i].style.transform = `translateX(${translate}px) translateY(${translateY}px)`;
        } else if (distanceToView >= window.innerHeight) {
            animations[i].style.opacity = 1;
            animations[i].style.transform = 'translateX(0)';
        } else {
            animations[i].style.opacity = 0;
            animations[i].style.transform = `translateX(${animationMinus[i]*50}px)`;
        }
    }

    lastScrollTop = scrollTop;

}

setInterval(timeCallback, 1000);

document.addEventListener("DOMContentLoaded", () => {

    for (let i = 0; i < animations.length; i++) {
        const computedStyle = window.getComputedStyle(animations[i]);
        const transformValue = computedStyle.transform;
        const matrixValues = transformValue.match(/matrix.*\((.+)\)/)[1].split(', ');
        const translateX = parseFloat(matrixValues[4]);
        animationMinus[i] = translateX > 0 ? 1 : -1;
    }

    timeCallback();
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll)
    });

    document.addEventListener("visibilitychange", handleScroll)

    setTimeout(() => {
        document.getElementById('spinner').remove()
    }, 1000);

    guest.addEventListener("change", () => {
        if(guest.value !== '' && guestValid.style.display === '') {
            guestValid.style.display = "none";
        }
    });

    guest.addEventListener("keydown", () => {
        if(guestValid.style.display === '') {
            guestValid.style.display = "none";
        }
    });

    attendances.forEach(attendance => {
        attendance.addEventListener("change", () => {
            if ((attendance.value !== null || String(attendance.value).trim() !== '') && attendanceValid.style.display === '') {
                attendanceValid.style.display = "none";
            }
        });
    });
});



// const handleIntersection = (entries, observer) => {
//     for (const entry of entries) {
//         entry.target.style.setProperty('--shown', entry.isIntersecting ? 1 : 0)
//     }
// }
//
// const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach((entry) => {
//         // console.log(entry.target);
//     })
// }, {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.5
// })

muteBtn.addEventListener('click', toggleMute)

// animations.forEach(animation => observer.observe(animation))

sendBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    if (guest.value === '') {
        guestValid.style.display = "";
    }
    const attendance = document.querySelector("input[name=attendance]:checked");


    if (attendance === null || attendance.value === '' || attendance.value === null) {
        attendanceValid.style.display = "";
    }

    if (guest.value !== '' && attendance.value !== '') {

        try {
            const response = await fetch('/.netlify/functions/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `*GuestName*: ${guest.value} \n*Attendance*: ${attendance.value}`
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }

        sendBtn.classList.add("active")
        document.getElementById("send-btn-text").innerText = "YUBORILDI"
    }
});

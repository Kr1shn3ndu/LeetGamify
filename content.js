console.log("LeetGamify Loaded");

const runtime =
    typeof browser !== "undefined"
        ? browser
        : chrome;

let waitingForResult = false;
let cooldown = false;
let previousText = "";

function playSound(file) {
    const audio = new Audio(runtime.runtime.getURL(file));
    audio.volume = 1.0;

    audio.play().catch(err => {
        console.log(err);
    });
}

function showOverlay(imageFile) {
    const old = document.getElementById("lc-overlay");
    if (old) old.remove();

    const img = document.createElement("img");

    img.id = "lc-overlay";
    img.src = runtime.runtime.getURL(imageFile);

    const isFail = imageFile.includes("faahh");

    img.className = `lc-overlay ${isFail ? "fail" : "success"}`;

    document.body.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, isFail ? 3000 : 6350);
}

function triggerSuccess() {
    playSound("sounds/mission_passed.mp3");
    showOverlay("images/mission_passed.png");
}

function triggerFail() {
    playSound("sounds/faahh.mp3");
    showOverlay("images/faahh.png");
}

document.addEventListener("click", (event) => {
    const btn = event.target.closest("button");

    if (!btn) return;

    const text = btn.innerText.trim().toLowerCase();

    if (text.includes("submit")) {
        console.log("Submit detected");

        waitingForResult = true;

        previousText = document.body.innerText;
    }
});

function checkResult() {
    if (!waitingForResult) return;
    if (cooldown) return;

    const currentText = document.body.innerText;

    if (currentText === previousText) {
        return;
    }

    const successKeywords = [
        "Accepted"
    ];

    const failKeywords = [
        "Wrong Answer",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Compile Error"
    ];

    for (const keyword of successKeywords) {
        if (
            currentText.includes(keyword) &&
            !previousText.includes(keyword)
        ) {
            waitingForResult = false;
            cooldown = true;

            setTimeout(() => {
                cooldown = false;
            }, 5000);

            triggerSuccess();
            return;
        }
    }

    for (const keyword of failKeywords) {
        if (
            currentText.includes(keyword) &&
            !previousText.includes(keyword)
        ) {
            waitingForResult = false;
            cooldown = true;

            setTimeout(() => {
                cooldown = false;
            }, 5000);

            triggerFail();
            return;
        }
    }

    previousText = currentText;
}

const observer = new MutationObserver(() => {
    requestAnimationFrame(checkResult);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("LeetGamify Observer Started");

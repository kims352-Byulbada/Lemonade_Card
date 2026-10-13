// [NEW] MC 멘트 카드처럼 한 장씩 넘기는 스크립트

const cards = document.querySelectorAll('.card');
const count = document.getElementById('count');
let current = 0;      // 지금 맨 위에 있는 카드 번호
let waiting = false;  // 넘어가는 중에는 다시 누르지 않게


// 카드 위치를 현재 번호에 맞게 다시 그림
function render() {
    cards.forEach((card, i) => {
        const distance = i - current;

        card.classList.remove('flipped', 'waiting');

        if (distance < 0) {
            // 이미 넘긴 카드
            card.classList.add('flipped');
            card.style.zIndex = 100 + i;
            card.style.transform = '';
            card.style.opacity = '';
        } else if (distance === 0) {
            // 지금 보이는 카드
            card.style.zIndex = 50;
            card.style.transform = 'none';
            card.style.opacity = 1;
        } else {
            // 뒤에 기다리는 카드: 조금씩 아래로, 작게, 살짝 기울여서
            const k = Math.min(distance, 3);
            const tilt = k % 2 === 1 ? 1.2 : -1.2;
            card.classList.add('waiting');
            card.style.zIndex = 50 - distance;
            card.style.transform = `translateY(${k * 12}px) scale(${1 - k * 0.04}) rotate(${tilt}deg)`;
            card.style.opacity = distance > 3 ? 0 : 1;
        }
    });

    count.textContent = `${current + 1} / ${cards.length}`;
}


// n번 카드로 이동
function goTo(n) {
    if (waiting) return;
    current = Math.max(0, Math.min(cards.length - 1, n));
    render();
}


cards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');

    if (checkbox) {
        // 단계 카드: 그림을 눌러 체크되면 "✓" 문구를 잠깐 보여주고 넘김
        checkbox.addEventListener('change', () => {
            if (!checkbox.checked) return;
            waiting = true;
            setTimeout(() => {
                waiting = false;
                goTo(current + 1);
            }, 900);
        });
    } else {
        // 나머지 카드: 아무 데나 누르면 넘김
        card.addEventListener('click', () => goTo(current + 1));
    }
});


// 버튼과 키보드
document.getElementById('next').addEventListener('click', () => goTo(current + 1));
document.getElementById('prev').addEventListener('click', () => goTo(current - 1));

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
});


render();

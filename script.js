document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchBar = document.getElementById('search-bar');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date('2026-01-01T10:00:00');

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        const addMinutes = (date, minutes) => {
            return new Date(date.getTime() + minutes * 60000);
        };

        let talkIndex = 0;
        for (let i = 0; i < 6; i++) {
            if (i === 3) {
                // Lunch Break
                const breakElement = document.createElement('div');
                breakElement.classList.add('schedule-item', 'break');
                const breakEndTime = addMinutes(currentTime, 60);
                breakElement.innerHTML = `
                    <div class="schedule-time">${formatTime(currentTime)} - ${formatTime(breakEndTime)}</div>
                    <div class="talk-title">Lunch Break</div>
                `;
                scheduleContainer.appendChild(breakElement);
                currentTime = breakEndTime;
            }

            const talk = talksToRender.find(t => talks.indexOf(t) === talkIndex);
            if (talk) {
                const talkElement = document.createElement('div');
                talkElement.classList.add('schedule-item');

                const talkEndTime = addMinutes(currentTime, talk.duration);

                talkElement.innerHTML = `
                    <div class="schedule-time">${formatTime(currentTime)} - ${formatTime(talkEndTime)}</div>
                    <h2 class="talk-title">${talk.title}</h2>
                    <p class="talk-speakers">By: ${talk.speakers.join(', ')}</p>
                    <p class="talk-description">${talk.description}</p>
                    <div class="talk-categories">
                        ${talk.categories.map(category => `<span class="talk-category">${category}</span>`).join('')}
                    </div>
                `;
                scheduleContainer.appendChild(talkElement);
                currentTime = talkEndTime;
            }
            talkIndex++;


            if (i < 5 && i !== 2) {
                 currentTime = addMinutes(currentTime, 10); // 10 min break
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const helpButton = document.querySelector(".help");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("closePopup");
    const powerLight = document.querySelector('.power');
    const screen = document.querySelector('.screen');
    const startButton = document.getElementById('start');
    const selectButton = document.getElementById('select');
    const descriptionText = document.querySelector('.description-text');
    const pokemonName = document.getElementById("name");
    const pokemonSpecie = document.getElementById("specie");
    const pokemonHeight = document.getElementById("height");
    const pokemonWeight = document.getElementById("weight");
    const pokemonNumber = document.getElementById("number");
    const pokemonPhoto = document.getElementById("imagem-div");
    const soundtrack = new Audio('assets/audios/soundtrack.mp3');
    let showStatus = false;
    let index = 1;
    const limit = 151;

    soundtrack.volume = 0.2;
    soundtrack.loop = true;

    function playAudio() {
        const sound = document.getElementById('soundIcon');
        if (!sound.classList.contains('disable')) {
            const audio = new Audio('assets/audios/button.wav');
            audio.volume = 0.15;
            audio.play();
        }
    }

    function handleButtonAnimation(buttonClass) {
        const button = document.querySelector(buttonClass);
        button.classList.add('active-button-a-b');
        setTimeout(() => {
            button.classList.remove('active-button-a-b');
        }, 400);
    }

    function showDescription(pokemon) {
        descriptionText.innerText = pokemon.description;
    }

    function showStats(pokemon) {
        descriptionText.innerHTML = `
            <div class="status-section">
                <div class="types">
                    <div class="type-one">
                        <p class="type1">TYPE1/</p>
                        <p class="poke-type1"> ${pokemon.types[0]}</p>
                    </div>
                    ${pokemon.types[1] ? `
                    <div class="type-two">
                        <p class="type2">TYPE2/</p>
                        <p class="poke-type2"> ${pokemon.types[1]}</p>
                    </div>` : ''}
                </div>
                <div class="status">
                    <div>
                        <div class="title">
                            <p class="status-text">Base Stats</p>
                        </div>
                        <div class="status-elements">
                            <p>HP ${pokemon.hp}</p>
                            <p>ATK ${pokemon.attack}</p>
                            <p>DEF ${pokemon.defense}</p>
                            <p>SPD ${pokemon.speed}</p>
                            <p>SPC ${pokemon.special}</p>
                            <p>TOTAL ${pokemon.total}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function loadPokemonDetails(index) {
        getPokemonDetails(index).then((pokemon) => {
            pokemonName.innerText = pokemon.name;
            pokemonSpecie.innerText = pokemon.specie;
            pokemonHeight.innerText = `HT ${convertDecimetersToFeetInches(pokemon.height)}`;
            pokemonWeight.innerText = `WT ${convertWeightToLbs(pokemon.weight)}`;
            pokemonNumber.innerText = `Nº.${String(pokemon.number).padStart(3, '0')}`;
            pokemonPhoto.innerHTML = `<img class="imagem" src="${pokemon.photo}" alt="${pokemon.name}" width=50 height=50>`;

            if (showStatus) {
                showStats(pokemon);
            } else {
                showDescription(pokemon);
            }
        });
    }

    helpButton.addEventListener("click", () => {
        playAudio();
        popup.classList.remove("hidden");
        helpButton.style.display = "none";
    });

    closePopup.addEventListener("click", () => {
        playAudio();
        popup.classList.add("hidden");
        helpButton.style.display = "flex";
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (popup.classList.contains('hidden')) {
                helpButton.click();
            } else {
                closePopup.click();
            }
        }

        if (event.key === 'Enter') {
            startButton.click();
            const button = document.querySelector('.start');
            button.classList.add('start-select-active');
                setTimeout(() => {
                button.classList.remove('start-select-active');
            }, 400);
        }

        if (['z', 'Z', 'a', 'A', 'x', 'X', 'b', 'B', ' '].includes(event.key)) {
            if (['z', 'Z', 'a', 'A'].includes(event.key)) {
                handleButtonAnimation('.b-a');
            }

            if (['x', 'X', 'b', 'B'].includes(event.key)) {
                handleButtonAnimation('.b-b');
            }

            if (event.key === ' ') {
                const button = document.querySelector('.select');
                button.classList.add('start-select-active');
                setTimeout(() => {
                    button.classList.remove('start-select-active');
                }, 400);
            }

            if (event.key === ' ') {
                event.preventDefault();
                handleButtonAnimation('.select');
            }

            if (!powerLight.classList.contains('ligado')) return;
            playAudio();
            showStatus = !showStatus;
            loadPokemonDetails(index);
        }

        if (event.key === 'ArrowRight') {
            const button = document.querySelector('.d-x-right');
                button.classList.add('active-button-x');
                setTimeout(() => {
                button.classList.remove('active-button-x');
            }, 400);
            if (!powerLight.classList.contains('ligado')) {
                return;
            }
            handleRight();
        } 
        if (event.key === 'ArrowLeft') {
            const button = document.querySelector('.d-x-left');
                button.classList.add('active-button-x');
                setTimeout(() => {
                button.classList.remove('active-button-x');
            }, 400);
            if (!powerLight.classList.contains('ligado')) {
                return;
            }
            handleLeft();
        } 
    });

    startButton.addEventListener('click', () => {
        if (powerLight.classList.contains('ligado')) {
            powerLight.classList.remove('ligado');
            soundtrack.pause();
            soundtrack.currentTime = 0;
            index = 1;
            screen.classList.add('off');
        } else {
            powerLight.classList.add('ligado');
            screen.classList.remove('off');
            if (document.getElementById('soundIcon').classList.contains('enable')) {
                audioTurnOn = new Audio('assets/audios/turn-on.mp3');
                audioTurnOn.volume = 0.2;
                audioTurnOn.play();
            }
            soundtrack.play();
            loadPokemonDetails(index);
        }
    });

    selectButton.addEventListener('click', () => {
        if (!powerLight.classList.contains('ligado')) return;
        playAudio();
        showStatus = !showStatus;
        loadPokemonDetails(index);
    });

    function handleRight() {
        if (index < limit) {
            index++;
        } else {
            index = 1;
        }
        playAudio();
        loadPokemonDetails(index);
    }

    function handleLeft() {
        if (index > 1) {
            index--;
        } else {
            index = limit;
        }
        playAudio();
        loadPokemonDetails(index);
    }

    document.querySelector('.button-sound').addEventListener('click', function () {
        const soundIcon = document.getElementById('soundIcon');
        if (soundIcon.classList.contains('enable')) {
            soundIcon.src = 'assets/images/sound-disable.svg';
            soundIcon.classList.remove('enable');
            soundIcon.classList.add('disable');
            soundtrack.volume = 0;
        } else {
            soundIcon.src = 'assets/images/sound-enable.svg';
            soundIcon.classList.remove('disable');
            soundIcon.classList.add('enable');
            soundtrack.volume = 0.2;
            playAudio();
        }
    });

    loadPokemonDetails(index);
});

function convertDecimetersToFeetInches(decimeters) {
    const meters = decimeters / 10;
    const totalInches = meters * 39.37;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${String(inches).padStart(2, '0')}''`;
}

function convertWeightToLbs(hectograms) {
    const weightInKg = hectograms / 10;
    return `${(weightInKg * 2.20462).toFixed(1)} lb`;
}

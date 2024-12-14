const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeJSON) {
    const pokemon = new Pokemon();
    pokemon.name = pokeJSON.name;
    pokemon.height = pokeJSON.height;
    pokemon.weight = pokeJSON.weight;
    pokemon.number = pokeJSON.id;
    
    const types = pokeJSON.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.hp = pokeJSON.stats[0].base_stat;
    pokemon.attack = pokeJSON.stats[1].base_stat;
    pokemon.defense = pokeJSON.stats[2].base_stat;
    pokemon.special = pokeJSON.stats[3].base_stat;
    pokemon.speed = pokeJSON.stats[5].base_stat;
    pokemon.total = pokemon.hp + pokemon.attack + pokemon.defense + pokemon.special + pokemon.speed;

    pokemon.photo = pokeJSON.sprites["versions"]["generation-i"]["red-blue"]["front_gray"];

    return pokemon;
}

function getPokemonSpecies(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    return fetch(url)
        .then((response) => response.json())
        .then((speciesJSON) => {
            const specie = speciesJSON.genera[7].genus.split(' Pokémon')[0];

            const flavorTextEntries = speciesJSON.flavor_text_entries;

            const redFlavorTexts = flavorTextEntries.filter(entry => 
                entry.language.name === 'en' && entry.version.name === 'red'
            );

            let description = '';
            if (redFlavorTexts.length > 0) {
                description = redFlavorTexts[0].flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ');
            } else {
                description = "No description available";
            }

            return { specie, description };
        });
}

function getPokemonDetails(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    return fetch(url)
        .then((response) => response.json())
        .then((pokeJSON) => {
            const pokemon = convertPokeApiDetailToPokemon(pokeJSON);

            return getPokemonSpecies(pokemonId).then(({ specie, description }) => {
                pokemon.specie = specie;
                pokemon.description = description;
                return pokemon;
            });
        });
}
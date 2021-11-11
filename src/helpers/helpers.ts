import CharacterDataWrapper, { CharacterReturn, Character, CharacterIds } from "../dto/models/marvel-character";

export const toCharacterReturn = (wrapper: CharacterDataWrapper): CharacterReturn => {
    let characterReturn: CharacterReturn = {};
    if (wrapper?.data?.results && wrapper?.data?.results.length > 0) {
        const character: Character = wrapper.data.results[0];
        
        characterReturn = {
            id: character.id,
            name: character.name,
            description: character.description,
        };
    }

    return characterReturn;
};

export const extractCharacterIds = (wrapper: CharacterDataWrapper): CharacterIds => {
    let characterIds: CharacterIds = [];
    if (wrapper?.data?.results && wrapper?.data?.results.length > 0) {
        characterIds = wrapper.data.results.map((character) => ({
            id: character.id,
        }));
    }

    return characterIds;
};
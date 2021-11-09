export interface MarvelResponse {
    message: string;
}

interface Url {
    type?: string;
    url?: string;
}

interface Image {
    path?: string;
    extension?: string;
}

interface ComicList {
    available?: number;
    returned?: number;
    collectionURI?: string;
    items?: Array<ComicSummary>;
}

interface ComicSummary {
    resourceURI?: string;
    name?: string;
}

interface StoryList {
    available?: number;
    returned?: number;
    collectionURI?: string;
    items?: Array<StorySummary>;
}

interface StorySummary {
    resourceURI?: string;
    name?: string;
    type?: string;
}

interface EventList {
    available?: number;
    returned?: number;
    collectionURI?: string;
    items?: Array<EventSummary>;
}

interface EventSummary {
    resourceURI?: string;
    name?: string;
}

interface SeriesList {
    available?: number;
    returned?: number;
    collectionURI?: string;
    items?: Array<SeriesSummary>;
}

interface SeriesSummary {
    resourceURI?: string;
    name?: string;
}

interface CharacterDataWrapper {
    code?: number;
    status?: string;
    copyright?: string;
    attributionText?: string;
    attributionHTML?: string;
    etag?: string;
    data?: CharacterDataContainer;
}

interface CharacterDataContainer {
    offset?: number;
    limit?: number;
    total?: number;
    count?: number;
    results?: Array<Character>;
}

export interface Character {
    id?: number;
    name?: string;
    description?: string;
    modified?: Date;
    resourceURI?: string;
    urls?: Array<Url>;
    thumbnail?: Image;
    comics?: ComicList;
    stories?: StoryList;
    events?: EventList;
    series?: SeriesList;
}

export type CharacterReturn = Pick<Character, "id" | "name" | "description">;
export type CharacterIds = Array<Pick<Character, "id">>;

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

export default CharacterDataWrapper;
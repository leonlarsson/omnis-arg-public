export interface Environment {
    RATELIMITS: KVNamespace;
};

export type Route = {
    stage: number,
    pathname: string;
    correctAnswers: string[];
    correctResponse: string;
    notCorrectResponses: string[];
};

export type User = {
    ip: string;
    ratelimitedUntil: number;
};
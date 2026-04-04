export interface IAIGenerator<TInput, TOutput> {
    generate: (data: TInput) => Promise<TOutput>;
}
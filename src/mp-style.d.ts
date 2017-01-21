interface MPStyleOptions {
    /**
     * Render css-classes instead of explicit text-format styles
     */
    useClasses?: boolean;
    /**
     * The protocol for internal links ($h/$p) like maniaplanet://
     */
    mlProtocol?: string;
    /**
     * o, i, w etc. or 'color' to remove all colors
     */
    stripTags?: Array<string>;
}

/**
 * Translate maniaplanet- or TMF-formatted strings to HTML
 */
declare function MPStyle(input: string, options?: MPStyleOptions): string;

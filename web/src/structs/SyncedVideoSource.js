const SyncedVideoSource = class {
    constructor(uri) {
        /* Parse and Find Types, throw on UnsupportedSource */
        this.uri = new URL(uri);

        switch(this.uri.hostname) {
            case "www.youtube.com":
            case "youtube.com": {
                /* Parse URL */
                if (this.uri.pathname.startsWith("/watch"))
                    this.ytEmbedURL = this.uri.searchParams.get("v");

                this.srcType = SyncedVideoSource.sourceType.YOUTUBE;
                break;
            }

            case "youtu.be": {
                /* Parse URL */
                this.ytEmbedURL = this.uri.pathname.substring(1);
                this.srcType = SyncedVideoSource.sourceType.YOUTUBE;
                break;
            }

            default: {
                throw new Error("Unsupported Source");
            }
        }
    }

    static sourceType = {
        YOUTUBE: 1,
    };

    static isValidSource = (sourceURL) => {
        try { new URL(sourceURL); return true; }
        catch { return false; }
    }

    getSourceInfo = (source) => {
        /*
            This Method Populates a Source Information Structure
            sourceInfo = {
                uri: String (Source URL),
                srcType: sourceType (YT, DM, etc.)
            }
        */
    }
}

export default SyncedVideoSource;
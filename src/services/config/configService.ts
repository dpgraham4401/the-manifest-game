// import testJson from "/submit-manifest.json";

export const Config = {
  /** read and return the decision tree from a json file */
  fetchSubmitManifestTree: async () => {
    return await fetch("/submit-manifest.json");
  },
};

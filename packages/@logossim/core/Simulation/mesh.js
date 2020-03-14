/**
 * A "mesh" is a set of links that are connected to each other.
 *
 * (if there's a better technical name for this please let me know :P)
 *
 * This function receives all links and returns every mesh found,
 * containing the id of each link that makes part of it, as well as
 * a list of all input and output ports that those links connects to.
 *
 * The implementation is basically a DFS (depth first search) executed
 * on every link on the circuit that is not a bifurcation.
 */
const findMeshes = allLinks => {
  // Auxiliary functions
  const findLinkById = id => allLinks.find(l => id === l.id);

  const addRecursively = (link, mesh) => {
    if (!link || link.id in mesh) return;

    // eslint-disable-next-line no-param-reassign
    mesh[link.id] = true;

    addRecursively(findLinkById(link.bifurcation.source), mesh);
    addRecursively(findLinkById(link.bifurcation.target), mesh);
    link.bifurcations.forEach(bifurcation =>
      addRecursively(findLinkById(bifurcation), mesh),
    );
  };

  const findInputs = meshLinks =>
    meshLinks
      .map(link => findLinkById(link).source)
      .filter(source => source !== null);

  const findOutputs = meshLinks =>
    meshLinks
      .map(link => findLinkById(link).target)
      .filter(target => target !== null);

  // Start with no meshes
  const meshes = [];

  // For each link that is not a bifurcation
  allLinks
    .filter(link => !link.isBifurcation)
    .forEach(mainLink => {
      // If this link is already on a mesh, there's nothing to do
      if (meshes.find(mesh => mainLink.id in mesh)) return;

      // Otherwise, create a new mesh and recursively explore it
      const mesh = {};
      addRecursively(mainLink, mesh, allLinks);
      meshes.push(mesh);
    });

  return meshes
    .map(mesh => Object.keys(mesh))
    .map(meshLinks => ({
      links: meshLinks,
      inputs: findInputs(meshLinks),
      outputs: findOutputs(meshLinks),
    }));
};

export default findMeshes;

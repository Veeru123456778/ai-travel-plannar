// src/utils/itineraryUtils.js
export function haversineDistance(p1, p2) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestNeighborRoute(cluster, startPoint) {
  const toVisit = [...cluster];
  const route = [];
  let current = startPoint;

  while (toVisit.length) {
    let bestIdx = 0;
    let bestDist = Infinity;
    toVisit.forEach((p, i) => {
      const dist = haversineDistance(current, p);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    const [next] = toVisit.splice(bestIdx, 1);
    route.push(next);
    current = { lat: next.lat, lng: next.lng };
  }
  return route;
}

// ✅ MST-based clustering
function buildGraph(points) {
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = haversineDistance(points[i], points[j]);
      edges.push({ u: i, v: j, dist });
    }
  }
  // Debug: print distances
  console.log("All Pair Distances:");
  edges.forEach(e =>
    console.log(`${points[e.u].name} - ${points[e.v].name}: ${e.dist.toFixed(2)} km`)
  );
  return edges;
}

function kruskalMST(points, edges) {
  edges.sort((a, b) => a.dist - b.dist);
  const parent = Array.from({ length: points.length }, (_, i) => i);

  const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (x, y) => { parent[find(x)] = find(y); };

  const mst = [];
  for (const edge of edges) {
    if (find(edge.u) !== find(edge.v)) {
      union(edge.u, edge.v);
      mst.push(edge);
    }
  }
  return mst;
}

function partitionMST(mst, k) {
  mst.sort((a, b) => b.dist - a.dist); // largest first
  const cutEdges = mst.slice(0, k - 1);
  const remaining = mst.slice(k - 1);

  const adj = {};
  remaining.forEach(({ u, v }) => {
    if (!adj[u]) adj[u] = [];
    if (!adj[v]) adj[v] = [];
    adj[u].push(v);
    adj[v].push(u);
  });

  const visited = new Set();
  const clusters = [];
  const totalNodes = mst.length + 1;
  for (let i = 0; i < totalNodes; i++) {
    if (!visited.has(i)) {
      const stack = [i], cluster = [];
      while (stack.length) {
        const node = stack.pop();
        if (visited.has(node)) continue;
        visited.add(node);
        cluster.push(node);
        (adj[node] || []).forEach(n => !visited.has(n) && stack.push(n));
      }
      clusters.push(cluster);
    }
  }
  return clusters;
}

function computeCentroid(clusterPoints) {
  const sum = clusterPoints.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return { lat: sum.lat / clusterPoints.length, lng: sum.lng / clusterPoints.length };
}

function balanceClusters(clusters, points, groupSize) {
  const overflow = [];
  clusters = clusters.map(c => {
    if (c.length > groupSize) {
      const extras = c.splice(groupSize);
      overflow.push(...extras);
    }
    return c;
  });

  clusters.forEach(c => {
    while (c.length < groupSize && overflow.length) {
      let bestIdx = 0, bestDist = Infinity;
      overflow.forEach((pIdx, i) => {
        const centroid = computeCentroid(c.map(i => points[i]));
        const dist = haversineDistance(points[pIdx], centroid);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      c.push(overflow.splice(bestIdx, 1)[0]);
    }
  });

  if (overflow.length) clusters[clusters.length - 1].push(...overflow);
  return clusters;
}

export function mstCluster(points, days, groupSize = 3) {
  const edges = buildGraph(points);
  const mst = kruskalMST(points, edges);
  let clusters = partitionMST(mst, days);
  clusters = balanceClusters(clusters, points, groupSize);
  return clusters.map(clusterIdxs => clusterIdxs.map(i => points[i]));
}

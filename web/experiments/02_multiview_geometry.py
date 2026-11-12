#!/usr/bin/env python3
"""Synthetic calibrated two-view geometry: epipolar residual and triangulation.
Run: python 02_multiview_geometry.py
Dependencies: numpy, matplotlib
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def skew(t):
    x, y, z = t
    return np.array([[0, -z, y], [z, 0, -x], [-y, x, 0]], dtype=float)

def project(P, X):
    Xh = np.c_[X, np.ones(len(X))]
    q = (P @ Xh.T).T
    return q[:, :2] / q[:, 2:3]

def triangulate_dlt(P1, P2, x1, x2):
    points = []
    for a, b in zip(x1, x2):
        A = np.stack([a[0]*P1[2]-P1[0], a[1]*P1[2]-P1[1],
                      b[0]*P2[2]-P2[0], b[1]*P2[2]-P2[1]])
        _, _, vt = np.linalg.svd(A)
        Xh = vt[-1]
        points.append(Xh[:3] / Xh[3])
    return np.asarray(points)

def main():
    rng = np.random.default_rng(17)
    f, baseline = 800.0, 0.20
    K = np.array([[f, 0, 640], [0, f, 360], [0, 0, 1.0]])
    R = np.eye(3)
    t = np.array([-baseline, 0.0, 0.0])
    P1 = K @ np.c_[np.eye(3), np.zeros(3)]
    P2 = K @ np.c_[R, t]
    X = np.c_[rng.uniform(-1, 1, 120), rng.uniform(-0.6, 0.6, 120),
              rng.uniform(3.0, 8.0, 120)]
    x1 = project(P1, X) + rng.normal(0, 0.35, (len(X), 2))
    x2 = project(P2, X) + rng.normal(0, 0.35, (len(X), 2))
    x1n = np.c_[(x1[:, 0]-K[0, 2])/f, (x1[:, 1]-K[1, 2])/f, np.ones(len(X))]
    x2n = np.c_[(x2[:, 0]-K[0, 2])/f, (x2[:, 1]-K[1, 2])/f, np.ones(len(X))]
    E = skew(t) @ R
    epi = np.abs(np.einsum("ni,ij,nj->n", x2n, E, x1n))
    Xhat = triangulate_dlt(P1, P2, x1, x2)
    depth_error = np.abs(Xhat[:, 2] - X[:, 2])
    reproj1 = np.linalg.norm(project(P1, Xhat)-x1, axis=1)
    reproj2 = np.linalg.norm(project(P2, Xhat)-x2, axis=1)
    print("TWO-VIEW GEOMETRY")
    print(f"median_epipolar_algebraic_residual={np.median(epi):.6e}")
    print(f"median_depth_abs_error_m={np.median(depth_error):.6f}")
    print(f"median_reprojection_error_px={np.median(np.r_[reproj1,reproj2]):.6f}")
    print(f"points_positive_depth={np.mean((Xhat[:,2]>0).astype(float)):.3f}")
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.scatter(X[:, 2], depth_error, s=12, alpha=.65)
    ax.set(xlabel="ground-truth depth (m)", ylabel="absolute depth error (m)",
           title="Triangulation error grows as parallax decreases")
    fig.tight_layout()
    fig.savefig("02_multiview_geometry.png", dpi=160)
    print("Saved: 02_multiview_geometry.png")

if __name__ == "__main__":
    main()

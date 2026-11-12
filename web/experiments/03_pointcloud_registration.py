#!/usr/bin/env python3
"""Robust trimmed ICP on a synthetic 3-D point cloud.
Run: python 03_pointcloud_registration.py
Dependencies: numpy, matplotlib
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def rot_z(a):
    c, s = np.cos(a), np.sin(a)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1.0]])

def kabsch(A, B):
    ca, cb = A.mean(axis=0), B.mean(axis=0)
    H = (A-ca).T @ (B-cb)
    U, _, Vt = np.linalg.svd(H)
    R = Vt.T @ U.T
    if np.linalg.det(R) < 0:
        Vt[-1] *= -1
        R = Vt.T @ U.T
    t = cb - R @ ca
    return R, t

def nearest_neighbors(A, B):
    d2 = np.sum((A[:, None, :] - B[None, :, :])**2, axis=2)
    idx = np.argmin(d2, axis=1)
    return B[idx], np.sqrt(d2[np.arange(len(A)), idx])

def rotation_error(R_est, R_true):
    c = np.clip((np.trace(R_est @ R_true.T)-1)/2, -1.0, 1.0)
    return np.degrees(np.arccos(c))

def main():
    rng = np.random.default_rng(23)
    src = rng.normal(size=(320, 3))
    R_true, t_true = rot_z(0.32), np.array([0.35, -0.22, 0.14])
    clean = src @ R_true.T + t_true
    target = clean + rng.normal(0, 0.004, clean.shape)
    target = np.vstack([target, rng.uniform(-2.5, 2.5, (45, 3))])
    R_est, t_est = rot_z(0.24), np.array([0.22, -0.12, 0.08])
    rmse_history = []
    for _ in range(40):
        moved = src @ R_est.T + t_est
        matched, distances = nearest_neighbors(moved, target)
        keep = distances <= np.quantile(distances, 0.82)
        delta_R, delta_t = kabsch(moved[keep], matched[keep])
        R_est = delta_R @ R_est
        t_est = delta_R @ t_est + delta_t
        moved = src @ R_est.T + t_est
        matched, distances = nearest_neighbors(moved, target)
        rmse_history.append(np.sqrt(np.mean(distances[distances <= np.quantile(distances, .82)]**2)))
    print("POINT CLOUD REGISTRATION")
    print(f"rotation_error_deg={rotation_error(R_est, R_true):.6f}")
    print(f"translation_error={np.linalg.norm(t_est-t_true):.6f}")
    print(f"trimmed_correspondence_rmse={rmse_history[-1]:.6f}")
    print("The target includes 45 outlier points; the ICP update trims the largest 18% of correspondence distances.")
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(rmse_history)
    ax.set(xlabel="ICP iteration", ylabel="trimmed RMSE", title="Robust trimmed ICP convergence")
    fig.tight_layout()
    fig.savefig("03_pointcloud_registration.png", dpi=160)
    print("Saved: 03_pointcloud_registration.png")

if __name__ == "__main__":
    main()

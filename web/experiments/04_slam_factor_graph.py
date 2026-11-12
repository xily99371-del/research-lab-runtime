#!/usr/bin/env python3
"""A minimal 1-D pose-graph experiment showing drift and gauge freedom.
This is a teaching analogue, not a full SE(3) SLAM implementation.
Run: python 04_slam_factor_graph.py
Dependencies: numpy, matplotlib
"""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

def main():
    rng = np.random.default_rng(31)
    n = 12
    truth = np.arange(n, dtype=float)
    odom_sigma, loop_sigma = 0.16, 0.04
    measurements = np.diff(truth) + rng.normal(0, odom_sigma, n-1)
    loop_measurement = truth[-1] - truth[0] + rng.normal(0, loop_sigma)
    raw = np.r_[0.0, np.cumsum(measurements)]

    # Each row encodes x_j - x_i = z_ij, weighted by inverse standard deviation.
    rows, values = [], []
    for i, z in enumerate(measurements):
        row = np.zeros(n); row[i] = -1; row[i+1] = 1
        rows.append(row / odom_sigma); values.append(z / odom_sigma)
    loop = np.zeros(n); loop[0] = -1; loop[-1] = 1
    rows.append(loop / loop_sigma); values.append(loop_measurement / loop_sigma)
    A, b = np.asarray(rows), np.asarray(values)
    rank_unanchored = np.linalg.matrix_rank(A)
    # Fix x_0=0 to remove the global translation gauge.
    x_opt = np.zeros(n)
    x_opt[1:] = np.linalg.lstsq(A[:, 1:], b, rcond=None)[0]
    residual = A @ x_opt - b
    print("1-D POSE GRAPH")
    print(f"unanchored_rank={rank_unanchored}  variables={n}  gauge_nullity={n-rank_unanchored}")
    print(f"raw_odometry_rmse={np.sqrt(np.mean((raw-truth)**2)):.6f}")
    print(f"optimized_pose_rmse={np.sqrt(np.mean((x_opt-truth)**2)):.6f}")
    print(f"weighted_factor_residual_norm={np.linalg.norm(residual):.6f}")
    print("The anchor x_0=0 removes the unobservable global translation.")
    fig, ax = plt.subplots(figsize=(7, 4))
    ax.plot(truth, "k-o", label="ground truth")
    ax.plot(raw, "r--o", label="odometry only")
    ax.plot(x_opt, "b-o", label="factor graph + loop closure")
    ax.set(xlabel="pose index", ylabel="1-D position", title="Loop closure distributes accumulated drift")
    ax.legend()
    fig.tight_layout()
    fig.savefig("04_slam_factor_graph.png", dpi=160)
    print("Saved: 04_slam_factor_graph.png")

if __name__ == "__main__":
    main()

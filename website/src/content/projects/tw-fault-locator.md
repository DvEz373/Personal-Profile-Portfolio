---
title: AI Fault Locator for Power Lines
category: ai
coverFocus: "20.6% 13.5%"
coverZoom: 1.16
kind: professional
order: 4
featured: true
context: Client project for a power utility
start: "2025"
blurb: Travelling-wave physics and a deep neural network that turn one substation recording into a distance to the fault.
role: Researched and developed the physics-informed machine learning model.
problem: When a line faults, the utility has to find the fault fast to restore supply. The fault sends voltage wavefronts along the line at close to the speed of light, and the time between them gives the distance, but real recordings carry noise, reflections and fault resistance, so a time-based calculation alone can be inaccurate.
approach: A hybrid locator. Standard travelling-wave signal processing (Clarke transform, Teager energy, wavefront arrival times) extracts features from the recording, and a deep neural network turns them into a fault distance in kilometres.
result: On faults the model never saw in training, R² of 96.7 %, mean absolute error of 8.3 km and RMS error of 15.1 km. Handed over with the trained model, the scripts, the PSCAD dataset and a user guide.
stack: [PSCAD, MATLAB, Python, TensorFlow]
facts:
  - { label: Dataset, value: "1,944 simulated faults, 11 fault types" }
  - { label: Fault positions, value: "10 km to 290 km, Rf 0.01 Ω to 40 Ω" }
  - { label: Sampling, value: "Three phase voltages at 100 kHz" }
  - { label: Accuracy (unseen faults), value: "R² 96.7 %, MAE 8.3 km, RMSE 15.1 km" }
figures:
  - src: ../../assets/projects/tw-fault-locator/principle.png
    alt: A transmission line between two grids with a fault part-way along; wavefronts travel to both ends, a recorder at bus A captures them and the fault locator outputs the distance d.
    caption: The principle. Wavefronts from the fault reach the recorder, and the locator turns them into a distance.
  - src: ../../assets/projects/tw-fault-locator/hybrid-method.png
    alt: Pipeline from PSCAD simulation and phase voltages, through Clarke transform, Teager energy and arrival times, to a feature vector, a neural network and the fault distance with R² 96.7 percent.
    caption: The hybrid method, from simulated faults through travelling-wave features to the neural network.
---

## How we developed it

1. Power quality recorders at the utility's feeder outlets supplied the field data.
2. PSCAD models of the utility network and of a test transmission line.
3. Automated PSCAD runs to generate the fault dataset.
4. Single-ended and two-ended travelling-wave location prototyped in MATLAB.
5. The hybrid model built and trained in Python and TensorFlow.
6. Tested on unseen faults and handed over with a user guide.

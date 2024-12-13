import matplotlib.pyplot as plt
import numpy as np
import random

num_of_charge_points = 20
charge_point_power_kW = 11
interval_min = 15
num_of_intervals_per_hr = int(60 / interval_min)
total_intervals_per_year = 365 * 24 * num_of_intervals_per_hr
ev_consumption_kWh_per_km = 18 / 100

ev_charge_need_probability_to_km = {
    0: 0.3431,
    5.0: 0.0490,
    10.0: 0.0980,
    20.0: 0.1176,
    30.0: 0.0882,
    50.0: 0.1176,
    100.0: 0.1078,
    200.0: 0.0490,
    300.0: 0.0294
}

cumulative = 0.0
ev_charge_need_cm_probability_to_km = {}
for km, p in sorted(ev_charge_need_probability_to_km.items()):
    cumulative += p
    ev_charge_need_cm_probability_to_km[km] = cumulative

car_arrival_hourly_probability = [
    0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094, 0.0094,
    0.0283, 0.0283, 0.0566, 0.0566, 0.0566, 0.0755, 0.0755, 0.0755,
    0.1038, 0.1038, 0.1038,
    0.0472, 0.0472, 0.0472,
    0.0094, 0.0094
]
car_arrival_probability_by_interval = [p / num_of_intervals_per_hr for p in car_arrival_hourly_probability]


def did_car_arrive_to_charge_point(interval_of_day):
    return random.random() <= car_arrival_probability_by_interval[interval_of_day]


def get_distance():
    r = random.random()
    for d_km, p in ev_charge_need_cm_probability_to_km.items():
        if r <= p:
            return d_km
    return 0


power_history = []
charge_points_intervals = np.zeros(num_of_charge_points)

for interval in range(total_intervals_per_year):
    # reset charge points
    charge_points_intervals = np.maximum(0, charge_points_intervals - 1)

    for i, cp in enumerate(charge_points_intervals):
        # check if its free, and if car arrived
        if cp == 0 and did_car_arrive_to_charge_point(interval % 24):
            distance_km = get_distance()
            intervals_needed_to_charge = num_of_intervals_per_hr * (
                    (distance_km * ev_consumption_kWh_per_km) / charge_point_power_kW)
            if intervals_needed_to_charge > 0:
                charge_points_intervals[i] = intervals_needed_to_charge

    # record power consumption
    num_of_charge_points_in_use = np.sum(charge_points_intervals > 0)
    power_history.append(num_of_charge_points_in_use * charge_point_power_kW)

power_history = np.array(power_history)
actual_max_power_kW = np.max(power_history)
print("Max power consumption: ", actual_max_power_kW)
max_theoretical_power_kW = num_of_charge_points * charge_point_power_kW
print("Max theoretical power: ", max_theoretical_power_kW)
concurrency = actual_max_power_kW / max_theoretical_power_kW
print("Concurrency: ", concurrency)

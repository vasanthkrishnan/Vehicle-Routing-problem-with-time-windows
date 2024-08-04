class Individual {
    constructor(routes, fitness = 0) {
        this.routes = routes;
        this.fitness = fitness;
    }
}

class GeneticAlgorithm {
    constructor(customers, vehicles, populationSize, generations, mutationRate) {
        this.customers = customers;
        this.vehicles = vehicles;
        this.populationSize = populationSize;
        this.generations = generations;
        this.mutationRate = mutationRate;
        this.population = [];
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            let routes = this.vehicles.map(vehicle => ({
                vehicleId: vehicle.id,
                route: [this.customers[0]], // Start at depot
                remainingCapacity: vehicle.capacity
            }));

            let remainingCustomers = [...this.customers.slice(1)]; // Exclude depot

            while (remainingCustomers.length > 0) {
                routes.forEach(vehicleRoute => {
                    if (remainingCustomers.length > 0) {
                        for (let j = remainingCustomers.length - 1; j >= 0; j--) {
                            let customer = remainingCustomers[j];
                            if (customer.demand <= vehicleRoute.remainingCapacity) {
                                vehicleRoute.route.push(customer);
                                vehicleRoute.remainingCapacity -= customer.demand;
                                remainingCustomers.splice(j, 1);
                                break;
                            }
                        }
                    }
                });
            }

            routes.forEach(route => {
                route.route.push(this.customers[0]); // End at depot
            });

            this.population.push(new Individual(routes));
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    evaluateFitness() {
        this.population.forEach(individual => {
            individual.fitness = this.calculateFitness(individual.routes);
        });
    }

    calculateFitness(routes) {
        let totalDistance = 0;
        routes.forEach(vehicleRoute => {
            let routeDistance = 0;
            for (let i = 0; i < vehicleRoute.route.length - 1; i++) {
                routeDistance += this.distance(vehicleRoute.route[i], vehicleRoute.route[i + 1]);
            }
            totalDistance += routeDistance;
        });
        return 1 / totalDistance;
    }

    distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    selectParents() {
        return this.population.sort((a, b) => b.fitness - a.fitness).slice(0, 2);
    }

    crossover(parent1, parent2) {
        let child1Routes = [];
        let child2Routes = [];

        for (let i = 0; i < parent1.routes.length; i++) {
            let splitPoint = Math.floor(parent1.routes[i].route.length / 2);
            let child1Route = parent1.routes[i].route.slice(0, splitPoint).concat(parent2.routes[i].route.slice(splitPoint));
            let child2Route = parent2.routes[i].route.slice(0, splitPoint).concat(parent1.routes[i].route.slice(splitPoint));

            child1Routes.push({ ...parent1.routes[i], route: child1Route });
            child2Routes.push({ ...parent2.routes[i], route: child2Route });
        }

        return [new Individual(child1Routes), new Individual(child2Routes)];
    }

    mutate(individual) {
        individual.routes.forEach(vehicleRoute => {
            if (Math.random() < this.mutationRate) {
                let route = vehicleRoute.route.slice(1, -1); // Exclude depot
                let index1 = Math.floor(Math.random() * route.length);
                let index2 = Math.floor(Math.random() * route.length);
                [route[index1], route[index2]] = [route[index2], route[index1]];
                vehicleRoute.route = [this.customers[0], ...route, this.customers[0]];
            }
        });
    }

    run() {
        this.initializePopulation();
        this.evaluateFitness();

        for (let generation = 0; generation < this.generations; generation++) {
            let [parent1, parent2] = this.selectParents();

            let [child1, child2] = this.crossover(parent1, parent2);

            this.mutate(child1);
            this.mutate(child2);

            this.evaluateFitness();

            this.population.push(child1, child2);
            this.population = this.population.sort((a, b) => b.fitness - a.fitness).slice(0, this.populationSize);
        }

        return this.population[0].routes;
    }
}

module.exports = GeneticAlgorithm;

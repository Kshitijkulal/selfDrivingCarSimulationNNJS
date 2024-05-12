const simCanvas = document.getElementById("simCanvas");
simCanvas.width = 200;

const nnCanvas = document.getElementById("nnCanvas");
nnCanvas.width = 300;

const simCtx = simCanvas.getContext("2d");
const nnCtx = nnCanvas.getContext("2d");

const road = new Road(simCanvas.width/2, simCanvas.width * 0.88);

const N = 1;

const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestNN")){
    for(let i = 0 ; i < cars.length; i++){
        cars[i].head = JSON.parse(localStorage.getItem("bestNN"));
        if(i != 0){
            NeuralNetwork.mutate(
                cars[i].head,
                0.1
            );
        }
    }
}

let traffic = [];
let totalTrafficGenerated = 0; // Track total generated traffic cars

animate();

function save(){
    localStorage.setItem("bestNN", JSON.stringify(bestCar.head));
}

function discard(){
    localStorage.removeItem("bestNN");
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 5));
    }
    return cars;
}

function generateTraffic(){
    const distance = 150; // Fixed distance from the last generated traffic car
    const lastCar = traffic[traffic.length - 1];
    const frontPosition = lastCar ? lastCar.y - distance : 0;
    const laneCenter = road.getLaneCenter(Math.floor(Math.random() * 3)); // Random lane
    return new Car(laneCenter, frontPosition, 30, 50, "DUMMY", 2);
}

function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // Generate new traffic car if necessary and limit to 100 cars
    if (totalTrafficGenerated < 100 && (!traffic.length || bestCar.y - traffic[traffic.length - 1].y > 100)) {
        traffic.push(generateTraffic());
        totalTrafficGenerated++;
    }

    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    );

    simCanvas.height = window.innerHeight;
    nnCanvas.height = window.innerHeight;

    simCtx.save();
    simCtx.translate(0, -bestCar.y + simCanvas.height * 0.7);

    road.draw(simCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(simCtx, "blue");
    }
    simCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(simCtx, "white");
    }
    simCtx.globalAlpha = 1;
    bestCar.draw(simCtx, "white", true);
    simCtx.restore();
    nnCtx.globalAlpha = 1;
    nnCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(nnCtx, bestCar.head);
    requestAnimationFrame(animate);
}

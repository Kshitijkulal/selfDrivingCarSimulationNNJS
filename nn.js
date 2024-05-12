class NeuralNetwork{
    constructor (neuronCounts){
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1;i++){
            this.levels.push(
                new Level(
                    neuronCounts[i],
                    neuronCounts[i + 1]
                )
            );
        }
    }
    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]
        );
        for(let i = 1; i < network.levels.length;i++){
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }
        return outputs;
    }
    // mutating a network
    // amount should be between 0 and 1
    // if 0 it will be same and if it is more than zero it will be different
    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}

class Level {

    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount);
        }

        Level.randomize(this);
    }

    static randomize(level){
        for(let i = 0; i < level.inputs.length;i++){
            for(let j = 0; j < level.outputs.length;j++){
                level.weights[i][j] = Math.random()*2 - 1; // generates a random value between 1 && -1

            }
        }
        for(let i = 0; i < level.biases.length;i++){
            level.biases[i] = Math.random() * 2 -1;
        }
    }

    static feedForward(givenInputs, level){
        for (let i = 0; i < level.inputs.length;i++){
            level.inputs[i] = givenInputs[i];
        }
        for(let i = 0; i < level.outputs.length;i++){
            let sum = 0;
            for(let j = 0; j < level.inputs.length;j++){
                sum += level.inputs[j] * level.weights[j][i]; // the second dimension in the weights array is output and the first in input hence we took [j][i] here
            }
            if (sum > level.biases[i]){
                level.outputs[i] = 1;
            }
            else{
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}
// We implemented the hyperplane equation above
// In a very very simple network it could be the line Equation
// y = mx + c
// here it will be ws + b = 0 where w is weight s is sensor(input) and b is bias
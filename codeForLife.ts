/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/

type AvailableMolecules = {
  availableA: number;
  availableB: number;
  availableC: number;
  availableD: number;
  availableE: number;
};

type Sample = {
  sampleId: number;
  carriedBy: number;
  rank: number;
  costA: number;
  costB: number;
  costC: number;
  costD: number;
  costE: number;
  health: number;
};

type Robot = {
  target: string;
  storageA: number;
  storageB: number;
  storageC: number;
  storageD: number;
  storageE: number;
};

const projectCount: number = parseInt(readline());
for (let i = 0; i < projectCount; i++) {
  var inputs: string[] = readline().split(" ");
  const a: number = parseInt(inputs[0]);
  const b: number = parseInt(inputs[1]);
  const c: number = parseInt(inputs[2]);
  const d: number = parseInt(inputs[3]);
  const e: number = parseInt(inputs[4]);
}

const readRobot = (): Robot => {
  let robot: Robot = undefined;
  for (let i = 0; i < 2; i++) {
    var inputs: string[] = readline().split(" ");
    const target: string = inputs[0];
    const eta: number = parseInt(inputs[1]);
    const score: number = parseInt(inputs[2]);
    const storageA: number = parseInt(inputs[3]);
    const storageB: number = parseInt(inputs[4]);
    const storageC: number = parseInt(inputs[5]);
    const storageD: number = parseInt(inputs[6]);
    const storageE: number = parseInt(inputs[7]);
    const expertiseA: number = parseInt(inputs[8]);
    const expertiseB: number = parseInt(inputs[9]);
    const expertiseC: number = parseInt(inputs[10]);
    const expertiseD: number = parseInt(inputs[11]);
    const expertiseE: number = parseInt(inputs[12]);
    if (i === 0)
      robot = { target, storageA, storageB, storageC, storageD, storageE };
  }
  return robot;
};

const readMolecules = (): AvailableMolecules => {
  var inputs: string[] = readline().split(" ");
  const availableA: number = parseInt(inputs[0]);
  const availableB: number = parseInt(inputs[1]);
  const availableC: number = parseInt(inputs[2]);
  const availableD: number = parseInt(inputs[3]);
  const availableE: number = parseInt(inputs[4]);
  return { availableA, availableB, availableC, availableD, availableE };
};

const readSamples = (): Sample[] => {
  const samples: Sample[] = [];
  const sampleCount: number = parseInt(readline());
  for (let i = 0; i < sampleCount; i++) {
    var inputs: string[] = readline().split(" ");
    const sampleId: number = parseInt(inputs[0]);
    const carriedBy: number = parseInt(inputs[1]);
    const rank: number = parseInt(inputs[2]);
    const expertiseGain: string = inputs[3];
    const health: number = parseInt(inputs[4]);
    const costA: number = parseInt(inputs[5]);
    const costB: number = parseInt(inputs[6]);
    const costC: number = parseInt(inputs[7]);
    const costD: number = parseInt(inputs[8]);
    const costE: number = parseInt(inputs[9]);
    samples.push({
      sampleId,
      carriedBy,
      rank,
      health,
      costA,
      costB,
      costC,
      costD,
      costE,
    });
  }

  return samples;
};

const totalCost = (a: Sample): number =>
  a.costA + a.costB + a.costC + a.costD + a.costE;
const totalStorage = (r: Robot): number =>
  r.storageA + r.storageB + r.storageC + r.storageD + r.storageE;

const sampleComparator = (a: Sample, b: Sample): number =>
  totalCost(a) - totalCost(b) + a.health - b.health;

const isDiagnosed = (s: Sample): boolean => s.costA !== -1;

const needDiagnosis = (samples: Sample[]): boolean =>
  samples.every((s) => s.costA === -1);

const needMolecules = (robot: Robot, samples: Sample[]): boolean => {
  return (
    totalStorage(robot) < 10 &&
    totalStorage(robot) !==
      samples.map(totalCost).reduce((acc, current) => acc + current)
  );
};

const mySamples = (samples: Sample[]): Sample[] =>
  samples.filter((s) => s.carriedBy === 0);

const debug = (s: any) => console.error(s);

// action queue
const actions: String[] = [];

// game loop
while (true) {
  console.error("ici");
  console.error("ici22");

  const robot = readRobot();
  const availableMolecules = readMolecules();
  const samples = mySamples(readSamples());

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');
  console.error("ici22");

  let noOutput = true;
  if (actions.length > 0) {
    console.log(actions.shift());
    noOutput = false;
  } else {
    if (samples.length === 0) {
      debug("samples");
      actions.push("GOTO SAMPLES");
      actions.push("CONNECT 2");
    } else if (needDiagnosis(samples)) {
      debug("diagnosis");
      actions.push("GOTO DIAGNOSIS");
      samples.forEach((s) => {
        if (s.costA === -1) actions.push("CONNECT " + s.sampleId);
      });
    } else if (needMolecules(robot, samples)) {
      debug("molecules");
      actions.push("GOTO MOLECULES");
      samples.forEach((s) => {
        for (let i = 0; i < s.costA; i++) actions.push("CONNECT A");
        for (let i = 0; i < s.costB; i++) actions.push("CONNECT B");
        for (let i = 0; i < s.costC; i++) actions.push("CONNECT C");
        for (let i = 0; i < s.costD; i++) actions.push("CONNECT D");
        for (let i = 0; i < s.costE; i++) actions.push("CONNECT E");
      });
    } else {
      debug("labo");
      actions.push("GOTO LABORATORY");
      samples.forEach((s) => actions.push("CONNECT " + s.sampleId));
    }
  }

  if (actions.length > 0 && noOutput) console.log(actions.shift());
}

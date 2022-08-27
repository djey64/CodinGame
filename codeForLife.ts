/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/

const SAMPLES = "SAMPLES";
const DIAGNOSIS = "DIAGNOSIS";
const MOLECULES = "MOLECULES";
const LABORATORY = "LABORATORY";

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
  expertiseA: number;
  expertiseB: number;
  expertiseC: number;
  expertiseD: number;
  expertiseE: number;
  eta: number;
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
      robot = {
        target,
        storageA,
        storageB,
        storageC,
        storageD,
        storageE,
        eta,
        expertiseA,
        expertiseB,
        expertiseC,
        expertiseD,
        expertiseE,
      };
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

const debug = (s: any) => console.error(s);

const perform = (s: String) => console.log(s);

const go = (r: Robot, dest: string) => {
  if (r.target !== dest) actions.push("GOTO " + dest);
};

// action queue
const actions: String[] = [];

const totalCost = (a: Sample): number =>
  a.costA + a.costB + a.costC + a.costD + a.costE;
const totalStorage = (r: Robot): number =>
  r.storageA + r.storageB + r.storageC + r.storageD + r.storageE;

const isDiagnosed = (s: Sample): boolean => s.costA !== -1;

const mySamples = (samples: Sample[]): Sample[] =>
  samples.filter((s) => s.carriedBy === 0);

const sampleIsPossible = (
  robot: Robot,
  s: Sample,
  availableMolecules: AvailableMolecules
) =>
  5 + robot.expertiseA >= s.costA &&
  5 + robot.expertiseB >= s.costB &&
  5 + robot.expertiseC >= s.costC &&
  5 + robot.expertiseD >= s.costD &&
  5 + robot.expertiseE >= s.costE;

const actionIsPossible = (
  action: String,
  availableMolecules: AvailableMolecules
) => {
  if (action === "CONNECT A" && availableMolecules.availableA === 0)
    return false;
  if (action === "CONNECT B" && availableMolecules.availableB === 0)
    return false;
  if (action === "CONNECT C" && availableMolecules.availableC === 0)
    return false;
  if (action === "CONNECT D" && availableMolecules.availableD === 0)
    return false;
  if (action === "CONNECT E" && availableMolecules.availableE === 0)
    return false;
  return true;
};

const isComplete = (r: Robot, s: Sample) =>
  r.storageA + r.expertiseA >= s.costA &&
  r.storageB + r.expertiseB >= s.costB &&
  r.storageC + r.expertiseC >= s.costC &&
  r.storageD + r.expertiseD >= s.costD &&
  r.storageE + r.expertiseE >= s.costE;

const needSamples = (samples: Sample[]): boolean => {
  return samples.length === 0;
};

const needDiagnosis = (samples: Sample[]): boolean =>
  samples.every((s) => s.costA === -1);

const needMolecules = (robot: Robot, samples: Sample[]): boolean => {
  const anySampleNeed = samples.some(
    (s) =>
      s.costA > robot.expertiseA + robot.storageA ||
      s.costB > robot.expertiseB + robot.storageB ||
      s.costC > robot.expertiseC + robot.storageC ||
      s.costD > robot.expertiseD + robot.storageD ||
      s.costE > robot.expertiseE + robot.storageE
  );
  return totalStorage(robot) < 10 && anySampleNeed;
};

const fetchSamples = (r: Robot) => {
  let exp =
    r.expertiseA + r.expertiseB + r.expertiseC + r.expertiseD + r.expertiseE;
  go(r, SAMPLES);
  for (let i = 0; i < 3; i++) {
    if (exp > 8) actions.push("CONNECT 3");
    else if (exp >= 6) actions.push("CONNECT 2");
    else actions.push("CONNECT 1");
  }
};

const fetchMolecules = (
  r: Robot,
  samples: Sample[],
  availableMolecules: AvailableMolecules
) => {
  actions.splice(0, actions.length);

  const sorted = [
    { amount: availableMolecules.availableA, key: "A" },
    { amount: availableMolecules.availableB, key: "B" },
    { amount: availableMolecules.availableC, key: "C" },
    { amount: availableMolecules.availableD, key: "D" },
    { amount: availableMolecules.availableE, key: "E" },
  ].sort((a, b) => a.amount - b.amount);

  if (r.target !== "MOLECULES") {
    go(r, MOLECULES);
    return;
  }

  let i = 0;
  for (const s of samples) {
    for (const mol of sorted) {
      const cost = "cost" + mol.key;
      const expertise = "expertise" + mol.key;
      const storage = "storage" + mol.key;
      const available = "available" + mol.key;
      const totalOfMolNeededBefore = samples
        .filter((_, y) => y < i)
        .map((x) => x[cost])
        .reduce((acc, current) => acc + current, 0);

      if (
        availableMolecules[available] > 0 &&
        s[cost] + totalOfMolNeededBefore - r[expertise] - r[storage] > 0
      ) {
        actions.push("CONNECT " + mol.key);
        return;
      }
    }
    i++;
  }
};

const missingMolecules = (r: Robot, s: Sample): number =>
  Math.max(0, s.costA - r.expertiseA) +
  Math.max(0, s.costB - r.expertiseB) +
  Math.max(0, s.costC - r.expertiseC) +
  Math.max(0, s.costD - r.expertiseD) +
  Math.max(0, s.costE - r.expertiseE);

// game loop
while (true) {
  const robot = readRobot();
  const availableMolecules = readMolecules();
  const samples = mySamples(readSamples()).sort((a: Sample, b: Sample) => {
    const nbA = missingMolecules(robot, a);
    const nbB = missingMolecules(robot, b);

    const scoreA = a.health / nbA;
    const scoreB = b.health / nbB;

    return scoreB - scoreA;
  });

  // Write an action using console.log()
  // To debug: console.error('Debug messages...');

  if (robot.eta > 0) {
    perform("WAIT");
    continue;
  }

  let noOutput = true;
  if (actions.length > 0 && actionIsPossible(actions[0], availableMolecules)) {
    perform(actions.shift());
    noOutput = false;
  } else {
    if (needSamples(samples)) {
      fetchSamples(robot);
    } else if (needDiagnosis(samples)) {
      go(robot, DIAGNOSIS);
      samples.forEach((s) => {
        if (s.costA === -1) actions.push("CONNECT " + s.sampleId);
      });
    } else if (
      robot.target === DIAGNOSIS &&
      !needDiagnosis(samples) &&
      samples.some((s) => !sampleIsPossible(robot, s, availableMolecules))
    ) {
      // Throw impossible samples
      samples
        .filter((s) => !sampleIsPossible(robot, s, availableMolecules))
        .forEach((s) => {
          actions.push("CONNECT " + s.sampleId);
        });
    } else if (
      robot.target === LABORATORY &&
      samples.some((s) => isComplete(robot, s))
    ) {
      const s = samples.find((s) => isComplete(robot, s));
      actions.push("CONNECT " + s.sampleId);
    } else if (needMolecules(robot, samples)) {
      fetchMolecules(robot, samples, availableMolecules);
      if (actions.length === 0) go(robot, LABORATORY);
    } else if (!samples.some((s) => isComplete(robot, s))) {
      // throw All
      go(robot, DIAGNOSIS);
      samples.forEach((s) => {
        actions.push("CONNECT " + s.sampleId);
      });
    } else {
      go(robot, LABORATORY);
    }
  }

  if (actions.length > 0 && noOutput)
    if (actionIsPossible(actions[0], availableMolecules))
      perform(actions.shift());
    else {
      perform("GOTO MOLECULES");
    }
}

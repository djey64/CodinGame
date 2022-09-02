/**
 * Save humans, destroy zombies!
 **/

type HasCoord = {
  x: number;
  y: number;
};

type HasId = {
  id: number;
};

type Me = HasCoord;

type Human = HasId & HasCoord;

type Zombie = HasId &
  HasCoord & {
    nextX: number;
    nextY: number;
  };

type Inputs = {
  me: Me;
  humans: Human[];
  zombies: Zombie[];
};

const getRandom = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const readInputs = (): Inputs => {
  const zombies: Zombie[] = [];
  const humans: Human[] = [];

  var inputs: string[] = readline().split(" ");
  const x: number = parseInt(inputs[0]);
  const y: number = parseInt(inputs[1]);
  const me: Me = { x, y };
  const humanCount: number = parseInt(readline());
  for (let i = 0; i < humanCount; i++) {
    var inputs: string[] = readline().split(" ");
    const humanId: number = parseInt(inputs[0]);
    const humanX: number = parseInt(inputs[1]);
    const humanY: number = parseInt(inputs[2]);
    humans.push({ id: humanId, x: humanX, y: humanY });
  }
  const zombieCount: number = parseInt(readline());
  for (let i = 0; i < zombieCount; i++) {
    var inputs: string[] = readline().split(" ");
    const zombieId: number = parseInt(inputs[0]);
    const zombieX: number = parseInt(inputs[1]);
    const zombieY: number = parseInt(inputs[2]);
    const zombieXNext: number = parseInt(inputs[3]);
    const zombieYNext: number = parseInt(inputs[4]);
    zombies.push({
      id: zombieId,
      x: zombieX,
      y: zombieY,
      nextX: zombieXNext,
      nextY: zombieYNext,
    });
  }

  return { me, zombies, humans };
};

const distance = (a: HasCoord, b: HasCoord) =>
  Math.sqrt(
    Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2)
  );

// game loop
while (true) {
  const { me, zombies, humans } = readInputs();

  const sortedHumans = humans.sort((a, b) => distance(me, a) - distance(me, b));

  const nearestHuman = sortedHumans.filter((h) => {
    // Ignore humans if zombie is to close and can never been saved
    const closestZombie = zombies.sort(
      (a, b) => distance(h, a) - distance(h, b)
    )[0];
    const stepsToHuman = distance(h, closestZombie) / 400;
    const stepsToHumanForAsh = distance(h, me) / 1000;
    return stepsToHumanForAsh <= stepsToHuman;
  })[0];

  const sorted = zombies.sort(
    (a, b) =>
      distance(nearestHuman ?? sortedHumans[0], a) -
      distance(nearestHuman ?? sortedHumans[0], b)
  );

  console.log(sorted[0].nextX + " " + sorted[0].nextY); // Your destination coordinates
}

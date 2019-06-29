import { Model, Datastore } from ".";
import { LevelDbAdapter } from './lapisdb/datastore/adapters/leveldb.adapter';

/** @ignore */
export class Human {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

/** @ignore */
export class Planet extends Model<Planet> {
  name: string;
  index: number;
  people: Human[];

  constructor(name: string, index: number) {
    super(testStore)
    this.name = name
    this.index = index
    this.people = []
  }

  public addHuman() {
    this.people.push(new Human(`Citizen of planet ${this.name} number ${this.people.length + 1}`, 0))
  }

  public age() {
    this.people.forEach(human => human.age += 1)
  }
}

export let testStore: Datastore<Planet> = new Datastore<Planet>('test', new LevelDbAdapter(Planet, {name: 'test', directory: './database'}))

beforeEach(async () => {
  const items = await testStore.getItems()
  for(const item of items) {
    await item.delete()
  }
})

afterEach(async () => {
  const items = await testStore.getItems()
  for(const item of items) {
    await item.delete()
  }
})

export const testCreateRandomPlanets = async (push: boolean = false) => {
  const data: Planet[] = []
  for (let i = 0; i < 100; i++) {
    data.push(new Planet(`Planet ${i}`, i))
  }

  if (push) {
    for(const item of data) {
      await item.save()
    }
  }

  return data
}
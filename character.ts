class Character {
  name: string;
  userInput: string;
  userFilter: string;

  constructor(name: string, userInput: string, userFilter: string) {
    this.name = name;
    this.userInput = userInput;
    this.userFilter = userFilter;
  }

  async getCharacter(): Promise<string> {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${this.name}`
    );

    const responseData = await response.json();

    return responseData;
  }

  async callCharactersFunctionNextPage(nextPage: any): Promise<string> {
    const response = await fetch(nextPage);
    const responseData = await response.json();
    return responseData;
  }
  async callCharacterFiltered(): Promise<string> {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${this.userInput}&status=${this.userFilter}`
    );

    const responseData = await response.json();
    return responseData;
  }

  changeCharByFilter(userInput: string, userFilter: string) {
    this.userInput = userInput;
    this.userFilter = userFilter;
  }
  changeCharacter(name: string) {
    this.name = name;
  }
}

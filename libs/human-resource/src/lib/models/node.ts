export interface Node {
  id: number;
  name: string;
  job: string;
  img?: string | undefined;
  children?: Node[];
}

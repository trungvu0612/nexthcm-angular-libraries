export class WorkflowStatus {
  fontColor: string;
  fontSize: number;

  constructor(
    public id: string,
    public label: string,
    public fillColor?: string,
    public labelBackgroundColor?: string,
    fontColor?: string
  ) {
    this.fontColor = fontColor || 'white';
    this.fontSize = 14;
  }
}

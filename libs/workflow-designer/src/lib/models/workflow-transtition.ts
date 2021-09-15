export class WorkflowTransition {
  constructor(
    public id: string,
    public label: string,
    public targetId: string,
    public sourceId?: string,
    public isAll?: boolean
  ) {}
}

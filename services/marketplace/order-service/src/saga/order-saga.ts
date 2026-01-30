import { EventEmitter } from 'events';

/**
 * Represents a single step in a saga workflow
 */
export interface SagaStep<T = any> {
  name: string;
  execute: () => Promise<T>;
  compensate: () => Promise<void>;
}

/**
 * Saga execution result
 */
export interface SagaResult {
  success: boolean;
  steps: { name: string; result?: any; error?: string }[];
  error?: string;
}

/**
 * OrderSaga implements the Saga pattern for distributed transactions
 * Ensures data consistency across microservices through compensating transactions
 */
export class OrderSaga extends EventEmitter {
  private steps: SagaStep[] = [];
  private executedSteps: { name: string; result: any }[] = [];

  /**
   * Add a step to the saga workflow
   */
  addStep(step: SagaStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Execute all saga steps in sequence
   * If any step fails, compensating transactions are executed in reverse order
   */
  async execute(): Promise<SagaResult> {
    const results: { name: string; result?: any; error?: string }[] = [];

    try {
      for (const step of this.steps) {
        this.emit('step:start', step.name);
        console.log(`[Saga] Executing step: ${step.name}`);

        try {
          const result = await step.execute();
          this.executedSteps.push({ name: step.name, result });
          results.push({ name: step.name, result });
          
          this.emit('step:complete', step.name, result);
          console.log(`[Saga] Step completed: ${step.name}`);
        } catch (stepError: any) {
          console.error(`[Saga] Step failed: ${step.name}`, stepError);
          results.push({ name: step.name, error: stepError.message });
          throw stepError;
        }
      }

      this.emit('saga:complete', results);
      console.log('[Saga] All steps completed successfully');

      return {
        success: true,
        steps: results,
      };
    } catch (error) {
      this.emit('saga:error', error);
      console.error('[Saga] Execution failed, starting compensation', error);

      await this.compensate();

      return {
        success: false,
        steps: results,
        error: error.message,
      };
    }
  }

  /**
   * Execute compensating transactions in reverse order
   */
  private async compensate(): Promise<void> {
    this.emit('saga:compensating');
    console.log('[Saga] Starting compensation...');

    // Compensate in reverse order
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      const executedStep = this.executedSteps[i];
      const step = this.steps.find((s) => s.name === executedStep.name);

      if (step) {
        try {
          this.emit('step:compensate:start', step.name);
          console.log(`[Saga] Compensating step: ${step.name}`);

          await step.compensate();

          this.emit('step:compensate:complete', step.name);
          console.log(`[Saga] Compensation complete: ${step.name}`);
        } catch (compensateError: any) {
          console.error(`[Saga] Compensation failed: ${step.name}`, compensateError);
          this.emit('step:compensate:error', step.name, compensateError);
          // Continue with other compensations even if one fails
        }
      }
    }

    this.emit('saga:compensated');
    console.log('[Saga] Compensation process completed');
  }

  /**
   * Reset the saga for reuse
   */
  reset(): void {
    this.steps = [];
    this.executedSteps = [];
  }
}

export default OrderSaga;

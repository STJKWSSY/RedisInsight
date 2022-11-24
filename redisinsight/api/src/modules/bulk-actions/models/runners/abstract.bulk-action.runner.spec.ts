import IORedis from 'ioredis';
import {
  mockSocket,
} from 'src/__mocks__';
import {
  DeleteBulkActionSimpleRunner,
} from 'src/modules/bulk-actions/models/runners/simple/delete.bulk-action.simple.runner';
import { BulkAction } from 'src/modules/bulk-actions/models/bulk-action';
import { BulkActionType } from 'src/modules/bulk-actions/constants';
import { BulkActionFilter } from 'src/modules/bulk-actions/models/bulk-action-filter';
import { BulkActionProgress } from 'src/modules/bulk-actions/models/bulk-action-progress';
import { BulkActionSummary } from 'src/modules/bulk-actions/models/bulk-action-summary';

const mockExec = jest.fn();
const nodeClient = Object.create(IORedis.prototype);
nodeClient.sendCommand = jest.fn();
nodeClient.pipeline = jest.fn(() => ({
  exec: mockExec,
}));

const mockBulkActionFilter = new BulkActionFilter();

const mockCreateBulkActionDto = {
  id: 'bulk-action-id',
  databaseId: 'database-id',
  type: BulkActionType.Delete,
};

let bulkAction;

describe('AbstractBulkActionRunner', () => {
  let deleteRunner: DeleteBulkActionSimpleRunner;

  beforeEach(() => {
    bulkAction = new BulkAction(
      mockCreateBulkActionDto.id,
      mockCreateBulkActionDto.databaseId,
      mockCreateBulkActionDto.type,
      mockBulkActionFilter,
      mockSocket,
    );

    deleteRunner = new DeleteBulkActionSimpleRunner(bulkAction, nodeClient);
  });

  describe('getProgress + getSummary', () => {
    it('should get progress', async () => {
      expect(deleteRunner.getProgress()).toBeInstanceOf(BulkActionProgress);
      expect(deleteRunner.getSummary()).toBeInstanceOf(BulkActionSummary);
    });
  });
});

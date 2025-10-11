import { Router, Request, Response } from 'express';
import contractService from '../services/contract';
import { validateAddress } from '../utils/validators';

const router = Router();

/**
 * GET /api/contract/stats
 * Get contract statistics
 */
router.get('/stats', async (req: Request, res: Response, next) => {
  try {
    const stats = await contractService.getContractStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contract/balance/:address
 * Get user balance from contract
 */
router.get('/balance/:address', async (req: Request, res: Response, next) => {
  try {
    const { address } = req.params;
    
    validateAddress(address);

    const balance = await contractService.getUserBalance(address);
    
    res.json({
      address,
      balance,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contract/verify
 * Verify contract is accessible
 */
router.get('/verify', async (req: Request, res: Response, next) => {
  try {
    const isAccessible = await contractService.verifyContract();
    
    res.json({
      accessible: isAccessible,
      contractAddress: contractService['contract'].target,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


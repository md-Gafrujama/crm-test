import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test endpoint to check company data
export const testCompanyData = async (req, res) => {
  try {
    const { companyId } = req.params;
    console.log('Testing company data for ID:', companyId);

    // Get company data
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
        gaPropertyId: true,
        gaAccessToken: true,
        gaRefreshToken: true,
        gaTokenExpiry: true
      }
    });

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found',
        companyId: companyId
      });
    }

    res.json({
      success: true,
      company: {
        id: company.id,
        name: company.companyName,
        hasGAProperty: !!company.gaPropertyId,
        hasGATokens: !!(company.gaAccessToken && company.gaRefreshToken),
        gaPropertyId: company.gaPropertyId,
        tokenExpiry: company.gaTokenExpiry
      }
    });
  } catch (error) {
    console.error('Test company data error:', error);
    res.status(500).json({ error: error.message });
  }
};
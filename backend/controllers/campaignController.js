const prisma = require("../lib/prisma");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { created_at: "desc" },
    });

    return res.json({
      success: true,
      data: campaigns,
      message: "Campaigns fetched successfully",
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

const createCampaign = async (req, res) => {
  try {
    const { title, channel, budget, status, start_date } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, data: null, message: "Field title is required" });
    }
    if (!channel) {
      return res.status(400).json({ success: false, data: null, message: "Field channel is required" });
    }
    if (budget === undefined || budget === null) {
      return res.status(400).json({ success: false, data: null, message: "Field budget is required" });
    }
    if (!status) {
      return res.status(400).json({ success: false, data: null, message: "Field status is required" });
    }
    if (!start_date) {
      return res.status(400).json({ success: false, data: null, message: "Field start_date is required" });
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        channel,
        budget: parseFloat(budget),
        status,
        start_date: new Date(start_date),
      },
    });

    return res.status(201).json({
      success: true,
      data: campaign,
      message: "Campaign created successfully",
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Record not found",
      });
    }

    const { title, channel, budget, status, start_date } = req.body;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        channel,
        budget: budget !== undefined ? parseFloat(budget) : undefined,
        status,
        start_date: start_date ? new Date(start_date) : undefined,
      },
    });

    return res.json({
      success: true,
      data: updated,
      message: "Campaign updated successfully",
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Record not found",
      });
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return res.json({
      success: true,
      data: null,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Database error, please try again",
    });
  }
};

module.exports = {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};

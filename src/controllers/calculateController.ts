import { Request, Response } from "express";
import { addBusinessDays, addBusinessHours, clampToBusinessHoursBackward } from "../services/calculateDateService";
import { toColombia, toUtcIso } from "../utils/dates";

export async function calculateTime(req: Request, res: Response): Promise<Response> {
  const { days, hours, date } = req.query;

  if (!days && !hours) {
    return res
      .status(400)
      .json({ error: "InvalidParameters", message: "Debe enviar al menos days u hours" });
  }

  let startDate = date ? new Date(date as string) : new Date();

  if (isNaN(startDate.getTime())) {
    return res
      .status(400)
      .json({ error: "InvalidParameters", message: "Fecha inválida" });
  }

  let result = toColombia(startDate);

  const daysNumber = parseInt(days as string);
  if (!isNaN(daysNumber)) {
    result = await addBusinessDays(result, daysNumber);
  }

  const hoursNumber = parseInt(hours as string);
  if (!isNaN(hoursNumber)) {
    result = await addBusinessHours(result, hoursNumber);
  }

  result = clampToBusinessHoursBackward(result);

  return res.json({ date: toUtcIso(result) });
}
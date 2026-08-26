import React from "react";
import { HazardDiamond } from "~/features/notoc/components/HazardDiamond";
import { NotocIssuedAt } from "~/features/notoc/components/NotocIssuedAt";
import type { FlightNotoc } from "~/features/notoc/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  notoc: FlightNotoc;
  flightNumber: string;
  acknowledgedByName: string | null;
};

function kilograms(value: number): string {
  return `${value.toLocaleString()} kg`;
}

export function NotocDocumentForm({ notoc, flightNumber, acknowledgedByName }: Props) {
  const notocDocument = notoc.document;

  return (
    <article className="notoc-document mx-auto flex max-w-3xl flex-col gap-6 border border-gray-300 bg-white p-8 text-black shadow-sm">
      <header className="flex flex-col gap-2 border-b-2 border-black pb-4">
        <h1 className="text-xl font-bold uppercase tracking-wide">Notification to Captain</h1>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <span>
            <span className="font-bold">Flight:</span> <span className="font-mono">{flightNumber}</span>
          </span>
          <span>
            <span className="font-bold">Stage:</span> {toHuman.notoc.stage(notoc.stage)}
          </span>
          <span>
            <span className="font-bold">Issued:</span> <NotocIssuedAt at={notoc.issuedAt} />
          </span>
        </div>
        {notoc.acknowledgedAt !== null && (
          <p className="text-sm">
            <span className="font-bold">Accepted by:</span> {acknowledgedByName ?? "the operating crew"} on{" "}
            <NotocIssuedAt at={notoc.acknowledgedAt} />
          </p>
        )}
        <p className="text-xs italic">This document records the load at the moment it was issued.</p>
      </header>

      <section className="flex flex-col gap-2">
        <p className="border-2 border-black px-3 py-2 text-base font-bold uppercase">{notocDocument.statement}</p>
      </section>

      {notocDocument.dangerousGoods.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="border-b border-black text-sm font-bold uppercase tracking-wide">Dangerous goods</h2>
          {notocDocument.dangerousGoods.map((entry) => (
            <div key={`${entry.awb}-${entry.unNumber}`} className="notoc-entry flex gap-4 border border-black p-3">
              <div className="flex flex-col items-center gap-2 pt-1">
                <HazardDiamond hazardClass={entry.hazardClass} />
                {entry.subsidiaryRisk !== null && <HazardDiamond hazardClass={entry.subsidiaryRisk} />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div>
                  <p className="text-sm font-bold">{entry.properShippingName}</p>
                  <p className="font-mono text-xs">
                    UN{entry.unNumber} · {entry.awb} · Class {entry.hazardClass}{" "}
                    {toHuman.cargoManifest.hazardClass(entry.hazardClass)}
                    {entry.subsidiaryRisk !== null &&
                      ` · Subsidiary risk ${entry.subsidiaryRisk} ${toHuman.cargoManifest.hazardClass(entry.subsidiaryRisk)}`}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="font-bold uppercase">Packing group</dt>
                    <dd>{entry.packingGroup ?? "Not assigned"}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase">Packages</dt>
                    <dd>{entry.packages}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase">Net per package</dt>
                    <dd>{entry.netPerPackage}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase">Position</dt>
                    <dd>{entry.position ?? "Not reported"}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase">Compartment</dt>
                    <dd>{entry.compartment ?? "Not reported"}</dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase">Unloads at</dt>
                    <dd>{entry.unloadingAirport}</dd>
                  </div>
                </dl>
                {entry.cargoAircraftOnly && (
                  <p className="text-xs font-bold uppercase">Restricted to cargo aircraft only</p>
                )}
                <div className="border-t border-black pt-2 text-xs">
                  <p className="font-bold uppercase">Emergency response drill {entry.drill.ercCode}</p>
                  <p>
                    <span className="font-bold">Inherent risk:</span> {entry.drill.inherentRisk}
                  </p>
                  <p>
                    <span className="font-bold">Risk to aircraft and occupants:</span>{" "}
                    {entry.drill.riskToAircraftAndOccupants}
                  </p>
                  <p>
                    <span className="font-bold">Spill and fire procedure:</span> {entry.drill.spillAndFireProcedure}
                  </p>
                  {entry.drill.additionalRisks.map((risk) => (
                    <p key={risk}>
                      <span className="font-bold">Additional risk:</span> {risk}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {notocDocument.specialLoads.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="border-b border-black text-sm font-bold uppercase tracking-wide">Special loads</h2>
          {notocDocument.specialLoads.map((load) => (
            <div
              key={`${load.awb}-${load.position ?? "loose"}`}
              className="notoc-entry border border-black p-3 text-xs"
            >
              <p className="text-sm font-bold">{load.description}</p>
              <p className="font-mono">
                {load.awb} · {load.shc.join(" / ")} · {kilograms(load.grossKg)} · Position{" "}
                {load.position ?? "not reported"} · Compartment {load.compartment ?? "not reported"} · Unloads at{" "}
                {load.unloadingAirport}
              </p>
              {load.heaviestPiece !== null && (
                <p>
                  <span className="font-bold">Heaviest piece:</span> {kilograms(load.heaviestPiece.kg)} over{" "}
                  {load.heaviestPiece.lengthCm} × {load.heaviestPiece.widthCm} × {load.heaviestPiece.heightCm} cm
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {notocDocument.coldChain.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="border-b border-black text-sm font-bold uppercase tracking-wide">Cold chain assessments</h2>
          {notocDocument.coldChain.map((assessment) => (
            <div key={assessment.awb} className="notoc-entry border border-black p-3 text-xs">
              <p className="text-sm font-bold">{assessment.description}</p>
              <p className="font-mono">
                {assessment.awb} · {toHuman.cargoManifest.coldChainRegime(assessment.regime)} ·{" "}
                {toHuman.cargoManifest.coldChainRisk(assessment.risk)} risk · {assessment.marginHours} h margin
              </p>
              <p>{assessment.explanation}</p>
              {assessment.advisory && <p className="italic">Advisory only; this assessment prevents nothing.</p>}
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="border-b border-black text-sm font-bold uppercase tracking-wide">Load summary</h2>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs">
          <div>
            <dt className="font-bold uppercase">Cargo</dt>
            <dd>{kilograms(notocDocument.summary.cargoKg)}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase">Baggage</dt>
            <dd>{kilograms(notocDocument.summary.baggageKg)}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase">Containers</dt>
            <dd>{notocDocument.summary.containerCount}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase">Pallets</dt>
            <dd>{notocDocument.summary.palletCount}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase">Loose lots</dt>
            <dd>{notocDocument.summary.looseLotCount}</dd>
          </div>
        </dl>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 text-left uppercase">Compartment</th>
              <th className="border border-black px-2 py-1 text-left uppercase">Weight</th>
              <th className="border border-black px-2 py-1 text-left uppercase">Dry ice</th>
            </tr>
          </thead>
          <tbody>
            {notocDocument.summary.compartments.map((compartment) => (
              <tr key={`${compartment.deck}-${compartment.compartment}`}>
                <td className="border border-black px-2 py-1">
                  {toHuman.cargoHold.deck(compartment.deck)} {compartment.compartment}
                </td>
                <td className="border border-black px-2 py-1">{kilograms(compartment.weightKg)}</td>
                <td className="border border-black px-2 py-1">{kilograms(compartment.dryIceKg)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}

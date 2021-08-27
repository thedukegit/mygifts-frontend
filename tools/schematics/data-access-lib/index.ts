import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import * as path from 'path';

export default function (schema: any): Rule {
  if (!schema.name.startsWith('data-access-')) {
    throw new Error("Data-access lib names should start with 'data-access-'");
  }

  const stateName = schema.name.substring(12);

  return chain([
    externalSchematic('@nrwl/workspace', 'lib', {
      name: schema.name,
      tags: 'data-access',
    }),
    externalSchematic('@nrwl/angular', 'ngrx', {
      name: stateName,
      module: path.join(
        'libs',
        schema.name,
        'scr',
        'lib',
        `${schema.name}.module.ts`
      ),
    }),
  ]);
}

import { PipelineStage } from 'mongoose';

/**
 * Builder class for constructing MongoDB aggregation pipeline stages.
 * Provides a fluent interface for creating complex aggregation pipelines.
 * 
 * @example
 * ```typescript
 * const pipeline = new PipelineStageBuilder()
 *   .withSearch('myIndex', { query: 'test', path: ['field'] })
 *   .withMatch({ status: 'active' })
 *   .withProject({ name: 1, email: 1 })
 *   .withLimit(10)
 *   .build();
 * ```
 */
export default class PipelineStageBuilder {
  private stages: PipelineStage[] = [];
  private index?: string;
  private fuzzy?: Record<string, unknown>;
  private fieldsToSearchIn?: string[];

  withSearchIndex(index: string): this {
    this.index = index;
    return this;
  }
  withFieldsToSearchIn(path: string[]): this {
    this.fieldsToSearchIn = path;
    return this;
  }
  withSearchFuzzy(fuzzy: Record<string, unknown>): this {
    this.fuzzy = fuzzy;
    return this;
  }

  /**
   * Add a $search stage to the pipeline (MongoDB Atlas Search).
   * @param index - The search index name
   * @param searchQuery - The search query configuration
   * @returns The builder instance for chaining
   */
  withSearch(searchQuery: Record<string, unknown>): this {
    this.stages.push({
      $search: {
        index: this.index,
        ...searchQuery
      }
    });
    return this;
  }

  /**
   * Add a $search stage with text search (MongoDB Atlas Search).
   * Convenience method for text-based searches.
   * @param index - The search index name
   * @param query - The text query string
   * @param path - The fields to search in
   * @param fuzzy - Optional fuzzy search configuration
   * @returns The builder instance for chaining
   */
  withTextSearch(query: string): this {
    this.stages.push({
      $search: {
        index: this.index,
        text: {
          query,
          path: this.fieldsToSearchIn,
          ...(Object.keys(this.fuzzy ?? {}).length > 0 ? { fuzzy: this.fuzzy } : {})
        }
      }
    });
    return this;
  }

  /**
   * Add a $match stage to filter documents.
   * @param query - The match criteria
   * @returns The builder instance for chaining
   */
  withMatch(query: Record<string, any>): this {
    this.stages.push({ $match: query });
    return this;
  }

  /**
   * Add a $match stage with expression-based matching.
   * Useful for comparing fields or using aggregation expressions.
   * @param expression - The expression to evaluate
   * @returns The builder instance for chaining
   */
  withMatchExpr(expression: Record<string, any>): this {
    this.stages.push({ $match: { $expr: expression } });
    return this;
  }

  /**
   * Add a $project stage to include/exclude fields.
   * @param projection - The projection specification
   * @returns The builder instance for chaining
   */
  withProject(projection: Record<string, any>): this {
    this.stages.push({ $project: projection });
    return this;
  }

  /**
   * Add a $project stage with computed fields using $slice for pagination.
   * Useful for paginating array fields within documents.
   * @param projection - The base projection specification
   * @param arrayField - The array field to slice
   * @param skip - Number of elements to skip
   * @param limit - Number of elements to return
   * @returns The builder instance for chaining
   */
  withProjectWithSlice(projection: Record<string, any>, arrayField: string, skip: number, limit: number): this {
    this.stages.push({
      $project: {
        ...projection,
        [arrayField]: {
          $slice: [`$${arrayField}`, skip, limit]
        }
      }
    });
    return this;
  }

  /**
   * Add a $project stage to exclude specific fields.
   * Convenience method for removing sensitive or unnecessary fields.
   * @param fields - Array of field names to exclude
   * @returns The builder instance for chaining
   */
  withProjectExclude(...fields: string[]): this {
    const projection: Record<string, number> = {};
    fields.forEach(field => {
      projection[field] = 0;
    });
    this.stages.push({ $project: projection });
    return this;
  }

  /**
   * Add a $project stage to include only specific fields.
   * @param fields - Array of field names to include
   * @returns The builder instance for chaining
   */
  withProjectInclude(...fields: string[]): this {
    const projection: Record<string, number> = {};
    fields.forEach(field => {
      projection[field] = 1;
    });
    this.stages.push({ $project: projection });
    return this;
  }

  /**
   * Add a $project stage to replace a field with another field's value.
   * Useful for renaming fields or replacing arrays after population.
   * @param projection - Base projection (fields to include/exclude)
   * @param fieldToReplace - The field name to replace
   * @param sourceField - The source field to use (use $ prefix for field reference)
   * @returns The builder instance for chaining
   */
  withProjectReplaceField(
    projection: Record<string, any>,
    fieldToReplace: string,
    sourceField: string
  ): this {
    this.stages.push({
      $project: {
        ...projection,
        [fieldToReplace]: sourceField.startsWith('$') ? sourceField : `$${sourceField}`
      }
    });
    return this;
  }

  /**
   * Add a $limit stage to limit the number of documents.
   * @param count - The maximum number of documents
   * @returns The builder instance for chaining
   */
  withLimit(count: number): this {
    this.stages.push({ $limit: count });
    return this;
  }

  /**
   * Add a $skip stage to skip documents.
   * @param count - The number of documents to skip
   * @returns The builder instance for chaining
   */
  withSkip(count: number): this {
    this.stages.push({ $skip: count });
    return this;
  }

  /**
   * Add a $sort stage to sort documents.
   * @param sortSpec - The sort specification (e.g., { field: 1 } for ascending)
   * @returns The builder instance for chaining
   */
  withSort(sortSpec: Record<string, 1 | -1>): this {
    this.stages.push({ $sort: sortSpec });
    return this;
  }

  /**
   * Add a $lookup stage to perform a left outer join.
   * @param from - The collection to join
   * @param localField - The field from the input documents
   * @param foreignField - The field from the documents of the "from" collection
   * @param as - The output array field name
   * @returns The builder instance for chaining
   */
  withLookup(from: string, localField: string, foreignField: string, as: string): this {
    this.stages.push({
      $lookup: {
        from,
        localField,
        foreignField,
        as
      }
    });
    return this;
  }

  /**
   * Add a $lookup stage with a sub-pipeline and variable definitions.
   * This enables complex joins with filtering, transformations, and enrichment.
   * @param config - The lookup configuration
   * @returns The builder instance for chaining
   */
  withLookupWithPipeline(config: {
    from: string;
    let?: Record<string, any>;
    pipeline: PipelineStage[];
    as: string;
  }): this {
    this.stages.push({
      $lookup: {
        from: config.from,
        ...(config.let ? { let: config.let } : {}),
        pipeline: config.pipeline as any,
        as: config.as
      }
    });
    return this;
  }

  /**
   * Add an $unwind stage to deconstruct an array field.
   * @param path - The field path to unwind
   * @param preserveNullAndEmptyArrays - Whether to include documents without the array field
   * @returns The builder instance for chaining
   */
  withUnwind(path: string, preserveNullAndEmptyArrays: boolean = false): this {
    this.stages.push({
      $unwind: {
        path,
        preserveNullAndEmptyArrays
      }
    });
    return this;
  }

  /**
   * Add a $group stage to group documents.
   * @param groupSpec - The group specification
   * @returns The builder instance for chaining
   */
  withGroup(groupSpec: Record<string, any>): this {
    this.stages.push({ $group: groupSpec });
    return this;
  }

  /**
   * Add a $addFields stage to add new fields.
   * @param fields - The fields to add
   * @returns The builder instance for chaining
   */
  withFields(fields: Record<string, any>): this {
    this.stages.push({ $addFields: fields });
    return this;
  }

  /**
   * Add a $count stage to count documents.
   * @param fieldName - The name of the output field with the count
   * @returns The builder instance for chaining
   */
  withCount(fieldName: string): this {
    this.stages.push({ $count: fieldName });
    return this;
  }

  /**
   * Add a custom pipeline stage.
   * @param stage - The pipeline stage to add
   * @returns The builder instance for chaining
   */
  withStage(stage: PipelineStage): this {
    this.stages.push(stage);
    return this;
  }

  /**
   * Add multiple custom pipeline stages.
   * @param stages - The pipeline stages to add
   * @returns The builder instance for chaining
   */
  withStages(stages: PipelineStage[]): this {
    this.stages.push(...stages);
    return this;
  }

  /**
   * Build and return the pipeline stages array.
   * @returns The array of pipeline stages
   */
  build(): PipelineStage[] {
    return this.stages;
  }

  /**
   * Reset the builder to start a new pipeline.
   * @returns The builder instance for chaining
   */
  reset(): this {
    this.stages = [];
    return this;
  }

  /**
   * Get the current number of stages in the pipeline.
   * @returns The number of stages
   */
  get length(): number {
    return this.stages.length;
  }
}
import { Caller } from "./caller";

test("success", async () => {
  const caller = new Caller();
  const [rez, err] = await caller.execute(`cd`, [`.`]);
  expect(err).toBeNull();
  expect(rez).toBe(``);
});

test("error", async () => {
  const caller = new Caller();
  const [rez, err] = await caller.execute(`wasdas`, [`.`, `asd`]);
  expect(rez).toBeNull();
  expect(err.message).toContain(`Command failed: wasdas . asd`);
});

UPDATE public.meet_marc_cards SET width=1024, height=768 WHERE id='3e2a7e53-2ccf-4a16-bb3f-c8a7aaeb380c';
UPDATE public.meet_marc_cards SET width=1600, height=2400 WHERE id='2332e231-f306-4993-8426-33b48b0f2108';
UPDATE public.meet_marc_cards SET width=3096, height=2064 WHERE id='b1dab96e-3049-420b-8922-2a131804ea71';
UPDATE public.meet_marc_cards SET width=3096, height=2064 WHERE id='39f3b64a-43ce-4f0c-8b40-3cacca9be989';
UPDATE public.carousel_slides SET width=2064, height=3096 WHERE id='9aae08b6-b94d-462e-b85f-8729b86c3a6f';
UPDATE public.carousel_slides SET width=3096, height=2064 WHERE id='f4cb139d-7637-40cb-89bc-13bf2045b1f2';
UPDATE public.carousel_slides SET width=1086, height=724 WHERE id='e7342175-f31f-4569-a030-c6db0352c592';
UPDATE public.carousel_slides SET width=2400, height=1600 WHERE id='1c1867bb-82a5-4b0b-8ca3-bdcc9c06ff2e';
UPDATE public.carousel_slides SET width=1200, height=630 WHERE id='2ada6f2a-dd7a-46c3-a571-5416c53c3e82';

-- Close gaps in carousel ordering (keeps the current sequence)
UPDATE public.carousel_slides c SET display_order = r.rn
FROM (SELECT id, row_number() OVER (ORDER BY display_order, id) AS rn FROM public.carousel_slides) r
WHERE c.id = r.id;

INSERT INTO public.section_content (section_name, title, paragraph)
SELECT 'speaking', 'Marc in Conversation', 'Talks and conversations on leadership, endurance, and designing a life with intention.'
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'speaking');

INSERT INTO public.section_content (section_name, title, paragraph)
SELECT 'social', 'In the Wild', ''
WHERE NOT EXISTS (SELECT 1 FROM public.section_content WHERE section_name = 'social');